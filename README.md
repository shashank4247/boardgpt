# BoardGPT

BoardGPT is a multi-agent AI system that simulates a board meeting to analyze decisions.

## Project Structure

- `backend/`: Python FastAPI backend
- `frontend/`: React + Vite frontend

## Prerequisites

- Python 3.8+
- Node.js 16+

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: Ensure you have `google-generativeai==0.8.5` installed.*

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add your API keys (e.g., `GOOGLE_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY`).

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### 1. Start the Backend server

In the `backend` directory, run:

```bash
python main.py
```
*Alternatively, you can run directly with uvicorn:*
```bash
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`.

### 2. Start the Frontend development server

In the `frontend` directory, run:

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Usage

1. Open your browser and navigate to the frontend URL.
2. Enter a decision topic/question.
3. Select the mode (Quick/Detailed).
4. Click "Analyze" to see the board's verdict.
