# EcoSort AI

EcoSort AI is a comprehensive full-stack web application that leverages Machine Learning directly in the application to classify waste and assess damage levels. The platform encourages sustainable behavior by offering users an "EcoPoints" reward system, tiers, and store redemptions.

## 🏗 Overall Architecture
EcoSort AI utilizes a monolithic Serverless Next.js architecture:
1. **Frontend**: Next.js App Router providing server-rendered and statically generated React components. Styling is heavily reliant on Tailwind CSS and accessible Radix UI primitives.
2. **Backend**: Built-in Next.js API Routes for handling authentication, database interactions, and business logic.
3. **Database**: MongoDB Atlas is used as the primary database, communicating with the backend via the Mongoose ODM.
4. **Machine Learning Pipeline**: TensorFlow.js is integrated directly into the application, enabling client/edge-based model predictions using models stored in the `public/models` directory.

---

## 🛠 Tech Stack

### Frontend Tools
- **Framework**: Next.js 16 / React 19
- **Styling**: Tailwind CSS (v4), PostCSS
- **UI Components**: Radix UI (Accordion, Dialog, Select, Dropdown Menu, etc.), `vaul` (Drawers), `sonner` (Toast Notifications)
- **Forms & Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Charts & Visualizations**: `recharts`
- **Icons**: `lucide-react`
- **Utilities**: `clsx`, `tailwind-merge`, `date-fns`

### Backend Tools
- **Framework**: Next.js API routes (Server-Side)
- **Authentication**: Custom JWT Authentication (`jsonwebtoken`) and Password Hashing (`bcryptjs`)
- **Image Processing**: `jimp` (For handling image transformations if needed)
- **Analytics**: `@vercel/analytics`

### Database Tools
- **Database Engine**: MongoDB (hosted on MongoDB Atlas)
- **ODM (Object Data Modeling)**: Mongoose (v9.4.1)

### Machine Learning Tools
- **Library**: TensorFlow.js (`@tensorflow/tfjs`)
- **Backend Optimization**: WebGL backend (`@tensorflow/tfjs-backend-webgl`) for GPU-accelerated browser inference. 
- **Model Format**: TensorFlow.js `LayersModel` (.json + .bin weights)

---

## 🧠 Machine Learning Models

The application incorporates two models running natively via TensorFlow.js.

### 1. Type Classification Model (`type_model`)
- **Input**: Image tensor (224x224x3), normalized [0, 1].
- **Output**: Probability distribution.
- **Classes**: `['E_Waste', 'Plastic', 'Metal', 'Glass']`.

### 2. Damage Assessment Model (`damage_model`)
- **Input**: Image tensor (224x224x3), normalized [0, 1].
- **Output**: Probability distribution.
- **Classes**: `['Minor', 'Moderate', 'Severe']`.
- **Note**: This model is only invoked when the type classification model predicts `E_Waste`.

---

## 🗄️ Database Schema Structure

The MongoDB database consists of six core collections:

### 1. `User` Collection
Stores user profiles, progress, and eco-tiers.
- `name` (String)
- `email` (String, Unique)
- `passwordHash` (String)
- `ecoPoints` (Number, Default: 25)
- `tier` (String: `Seedling` | `Green` | `EcoWarrior` | `EarthChampion` | `PlanetGuardian`)
- `recycledCount` (Number)
- `scanCount` (Number)
- `joinedAt` (Date)

### 2. `Prediction` Collection
Stores the history of ML waste classification scans.
- `userId` (ObjectId, Ref: User)
- `wasteType` (String)
- `confidence` (Number)
- `damageLevel` (String)
- `recommendation` (String)
- `imageUrl` (String)
- `recycled` (Boolean)
- `ecoPointsAwarded` (Number)
- `createdAt` (Date)

### 3. `EcoTransaction` Collection
Ledger to track when points are earned or spent.
- `userId` (ObjectId, Ref: User)
- `action` (String: `register` | `scan` | `recycle` | `redeem` | `bonus`)
- `points` (Number, positive for earn, negative for spent)
- `description` (String)
- `metadata` (Mixed Types)
- `createdAt` (Date)

### 4. `StoreItem` Collection
Items users can redeem their EcoPoints for.
- `name` (String)
- `description` (String)
- `ecoBenefit` (String)
- `category` (String: `Home` | `Tech` | `Apparel` | `Wellness`)
- `pointsCost` (Number)
- `tierRequired` (String: Ref: User Tier)
- `stock` (Number)
- `emoji` (String)
- `featured` (Boolean)
- `exclusive` (Boolean)

### 5. `RecyclingCenter` Collection
Location data for local recycling drop-offs.
- `name` (String)
- `address` (String)
- `city` (String, Indexed)
- `phone` (String)
- `hours` (String)
- `accepts` (Array of Strings)
- `verified` (Boolean)
- `mapsUrl` (String)
- `submittedBy` (ObjectId, Ref: User)
- `createdAt` (Date)

### 6. `Redemption` Collection
Receipts mapping users to the rewards they purchased.
- `userId` (ObjectId, Ref: User)
- `itemId` (ObjectId, Ref: StoreItem)
- `itemName` (String)
- `pointsSpent` (Number)
- `createdAt` (Date)
