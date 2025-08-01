import { useState, useCallback } from 'react';
import { SaveSlot, GameSaveState } from '../types';

const STORAGE_KEY = 'virtualMinesSaveSlots';
const NUM_SLOTS = 10;

const getInitialSlots = (): SaveSlot[] => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length === NUM_SLOTS) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading save slots from localStorage", error);
  }
  return Array(NUM_SLOTS).fill(null);
};

export function useSaveSlots() {
  const [slots, setSlots] = useState<SaveSlot[]>(getInitialSlots);

  const saveSlot = useCallback((index: number, state: GameSaveState) => {
    if (index < 0 || index >= NUM_SLOTS) return;
    
    const newSlots = [...slots];
    newSlots[index] = {
      ...state,
      lastSaved: new Date().toISOString(),
    };
    
    setSlots(newSlots);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
    } catch (error) {
       console.error("Error saving to localStorage", error);
    }
  }, [slots]);

  const deleteSlot = useCallback((index: number) => {
    if (index < 0 || index >= NUM_SLOTS) return;
    
    const newSlots = [...slots];
    newSlots[index] = null;
    
    setSlots(newSlots);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
    } catch (error) {
       console.error("Error saving to localStorage", error);
    }
  }, [slots]);

  return { slots, saveSlot, deleteSlot };
}
