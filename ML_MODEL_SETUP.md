# TensorFlow.js Model Setup Guide

This document explains how to add your pre-trained TensorFlow.js models to the EcoSort AI application.

## Directory Structure

Place your models in the `public/models/` directory:

```
public/
├── models/
│   ├── type_model/
│   │   ├── model.json
│   │   ├── weights.bin (or group1-shard1of1.bin for sharded models)
│   │   └── [additional weight files if sharded]
│   └── damage_model/
│       ├── model.json
│       ├── weights.bin
│       └── [additional weight files if sharded]
```

## Model Requirements

### Type Classification Model (`type_model`)
- **Input**: Image tensor (224x224x3) - normalized to [0, 1]
- **Output**: Probability distribution over waste classes
- **Classes**: `['E_Waste', 'Plastic', 'Metal', 'Glass']`
- **Framework**: TensorFlow.js compatible (LayersModel)

### Damage Assessment Model (`damage_model`)
- **Input**: E-Waste image tensor (224x224x3) - normalized to [0, 1]
- **Output**: Probability distribution over damage levels
- **Classes**: `['Minor', 'Moderate', 'Severe']`
- **Framework**: TensorFlow.js compatible (LayersModel)
- **Note**: Only used when waste type is classified as E_Waste

## Integration Steps

### 1. Add Model Files
1. Convert your TensorFlow/Keras models to TensorFlow.js format using:
   ```bash
   tensorflowjs_converter --input_format=keras_saved_model model_path/ web_model_path/
   # or for SavedModel format:
   tensorflowjs_converter --input_format=tf_saved_model model_path/ web_model_path/
   ```

2. Place the converted models in `public/models/type_model/` and `public/models/damage_model/`

### 2. Enable ML Pipeline in Code
Currently, the application uses mock predictions for demonstration. To use real models:

1. Uncomment the TensorFlow.js imports in `lib/ml-utils.ts`:
   ```typescript
   const tf = await import('@tensorflow/tfjs');
   ```

2. Replace mock implementations in:
   - `loadModel()` - Load from public/models directory
   - `preprocessImage()` - Actual image preprocessing with TensorFlow.js
   - `predictWasteType()` - Run type model inference
   - `predictDamageLevel()` - Run damage model inference

3. Update `app/page.tsx` to use real models:
   ```typescript
   import { initializeModels, runFullPrediction } from '@/lib/ml-utils';
   
   // In component:
   const { typeModel, damageModel } = await initializeModels();
   const result = await runFullPrediction(imageUrl, typeModel, damageModel);
   ```

### 3. Add TensorFlow.js Dependencies
If not already added, install TensorFlow.js:
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-backend-webgl
```

## Current Demo Mode

The application currently runs in **demo mode** with mock predictions that:
- Return random waste classifications from a predefined set
- Generate random confidence scores (0.8-0.95)
- For E-Waste, assign random damage levels
- Allow full UI/UX testing without model files

## Model Output Format

Your models should follow this format:

### Type Model Output
```javascript
const output = typeModel.predict(imageArray);
// Shape: [1, 4] - batch of 1, 4 classes
// Values: [E_Waste_prob, Plastic_prob, Metal_prob, Glass_prob]
// Sum to 1.0 (softmax)
```

### Damage Model Output
```javascript
const output = damageModel.predict(imageArray);
// Shape: [1, 3] - batch of 1, 3 damage levels
// Values: [Minor_prob, Moderate_prob, Severe_prob]
// Sum to 1.0 (softmax)
```

## Performance Considerations

- **Model Size**: Keep models under 10MB for fast loading
- **Input Size**: 224x224 is optimal for balanced accuracy/speed
- **Backend**: WebGL backend recommended for GPU acceleration
- **Caching**: Models are loaded once and reused for multiple predictions

## Testing

To test your models:

1. Upload an e-waste image through the UI
2. Click "Analyze Image"
3. Check the results in the Results Card
4. View the prediction history on the right panel

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Model not loading | Check file paths in `public/models/` |
| Wrong predictions | Verify input preprocessing matches training pipeline |
| Slow inference | Enable WebGL backend, reduce input size |
| Memory issues | Dispose tensors properly (already handled in utils) |

## File Exports

The ML utilities module exports:
- `loadModel(modelName)` - Load a model
- `preprocessImage(imageUrl)` - Prepare image for inference
- `predictWasteType(imageUrl, model)` - Run type classification
- `predictDamageLevel(imageUrl, model)` - Run damage assessment
- `runFullPrediction(imageUrl, typeModel, damageModel)` - Complete pipeline
- `initializeModels()` - Initialize both models

See `lib/ml-utils.ts` for detailed function documentation.
