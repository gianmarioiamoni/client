// Esempio di migrazione graduale Zustand → Redux
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useTaskStore } from '@/stores/task';

// 1. Mantieni Zustand per WebSocket real-time
const taskStore = useTaskStore();

// 2. Aggiungi Redux per logica business complessa
const businessLogicSlice = createSlice({
  name: 'businessLogic',
  initialState: {
    workflows: [],
    analytics: {}
  },
  reducers: {
    processComplexWorkflow: (state, action) => {
      // Logica business complessa qui
    }
  }
});

// 3. Hybrid approach: best of both worlds
const useHybridState = () => {
  // Real-time data con Zustand
  const realTimeData = useTaskStore();
  
  // Business logic con Redux
  const businessData = useSelector(state => state.businessLogic);
  
  return { realTimeData, businessData };
};

export { useHybridState };
