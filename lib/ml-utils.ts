/**
 * TensorFlow.js Inference — MobileNetV2-based models
 *
 * CRITICAL: MobileNetV2 expects input in [-1, 1] range.
 * Preprocessing: pixel / 127.5 - 1.0  (NOT pixel / 255)
 *
 * Type model    → /public/type_model/model.json    (224×224×3 in, 4 classes out)
 * Damage model  → /public/damage_model/model.json  (224×224×3 in, 3 classes out)
 */

export interface PredictionResult {
  wasteType: string;
  confidence: number;
  damageLevel?: string;
}

// Class labels (must match training order from class_labels.txt)
export const TYPE_CLASSES   = ['Battery', 'E_Waste', 'General_Recyclable', 'Non_Recyclable'] as const;
export const DAMAGE_CLASSES = ['Moderate', 'Severe', 'Slight'] as const;

// In-memory model cache
let _typeModel:   any = null;
let _damageModel: any = null;
let _tf:          any = null;

async function getTF() {
  if (_tf) return _tf;
  _tf = await import('@tensorflow/tfjs');
  // Prefer WebGL for speed; fallback to CPU
  try {
    await _tf.setBackend('webgl');
  } catch {
    await _tf.setBackend('cpu');
  }
  await _tf.ready();
  console.log('[ML] TF backend:', _tf.getBackend());
  return _tf;
}

/** Load a LayersModel from /public/<modelName>/model.json */
export async function loadModel(modelName: string): Promise<any> {
  const tf = await getTF();
  const url = `/${modelName}/model.json`;
  console.log(`[ML] Loading model: ${url}`);
  const model = await tf.loadLayersModel(url);
  model.summary();
  console.log(`[ML] ✓ Loaded ${modelName}`);
  return model;
}

export async function initializeModels(): Promise<{ typeModel: any; damageModel: any }> {
  if (!_typeModel)   _typeModel   = await loadModel('type_model');
  if (!_damageModel) _damageModel = await loadModel('damage_model');
  return { typeModel: _typeModel, damageModel: _damageModel };
}

/**
 * Preprocess image → [1, 224, 224, 3] float32 tensor in [-1, 1] range.
 *
 * MobileNetV2 preprocess_input:
 *   output = (pixel / 127.5) - 1.0
 */
function preprocessImage(imageUrl: string, inputSize = 224): Promise<any> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!imageUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = async () => {
      try {
        const tf = await getTF();
        // Resize to model input via canvas
        const canvas = document.createElement('canvas');
        canvas.width  = inputSize;
        canvas.height = inputSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
        ctx.drawImage(img, 0, 0, inputSize, inputSize);

        // MobileNetV2 normalization: [0,255] → [-1, 1]
        const tensor = tf.tidy(() =>
          tf.browser
            .fromPixels(canvas)          // [224, 224, 3]  uint8
            .toFloat()                   // [224, 224, 3]  float32  [0, 255]
            .div(tf.scalar(127.5))       // [224, 224, 3]  float32  [0, 2]
            .sub(tf.scalar(1.0))         // [224, 224, 3]  float32  [-1, 1]
            .expandDims(0)               // [1, 224, 224, 3]
        );

        resolve(tensor);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Image failed to load for preprocessing'));
    img.src = imageUrl;
  });
}

/** Type classification — returns waste type + confidence */
export async function predictWasteType(
  imageUrl: string,
  typeModel: any,
): Promise<{ wasteType: string; confidence: number }> {
  const tensor = await preprocessImage(imageUrl);
  try {
    const output = typeModel.predict(tensor) as any;
    const probs: number[] = Array.from(await output.data());
    output.dispose();
    tensor.dispose();

    const maxIdx = probs.indexOf(Math.max(...probs));
    console.log('[ML] Type probs:', TYPE_CLASSES.map((c, i) => `${c}=${(probs[i]*100).toFixed(1)}%`).join(' '));

    return {
      wasteType: TYPE_CLASSES[maxIdx] ?? 'E_Waste',
      confidence: probs[maxIdx],
    };
  } catch (err) {
    tensor.dispose();
    throw err;
  }
}

/** Damage assessment — only for E_Waste / Battery */
export async function predictDamageLevel(
  imageUrl: string,
  damageModel: any,
): Promise<string | undefined> {
  const tensor = await preprocessImage(imageUrl);
  try {
    const output = damageModel.predict(tensor) as any;
    const probs: number[] = Array.from(await output.data());
    output.dispose();
    tensor.dispose();

    const maxIdx = probs.indexOf(Math.max(...probs));
    console.log('[ML] Damage probs:', DAMAGE_CLASSES.map((c, i) => `${c}=${(probs[i]*100).toFixed(1)}%`).join(' '));

    return DAMAGE_CLASSES[maxIdx] ?? 'Moderate';
  } catch (err) {
    tensor.dispose();
    console.error('[ML] Damage prediction failed:', err);
    return undefined;
  }
}

/** Full pipeline: type → (optionally) damage */
export async function runFullPrediction(imageUrl: string): Promise<PredictionResult> {
  const { typeModel, damageModel } = await initializeModels();
  const typeResult = await predictWasteType(imageUrl, typeModel);

  let damageLevel: string | undefined;
  if (typeResult.wasteType === 'E_Waste' || typeResult.wasteType === 'Battery') {
    damageLevel = await predictDamageLevel(imageUrl, damageModel);
  }

  return {
    wasteType:  typeResult.wasteType,
    confidence: typeResult.confidence,
    damageLevel,
  };
}
