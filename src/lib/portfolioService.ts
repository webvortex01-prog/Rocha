import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { PortfolioItem } from '../types';
import { PORTFOLIO_ITEMS } from '../data';

const COLLECTION_NAME = 'portfolioItems';

export const subscribeToPortfolio = (onUpdate: (items: PortfolioItem[]) => void) => {
  const collectionRef = collection(db, COLLECTION_NAME);
  return onSnapshot(collectionRef, (snapshot) => {
    const items: PortfolioItem[] = [];
    snapshot.forEach((doc) => {
      items.push(doc.data() as PortfolioItem);
    });
    
    // Sort array descending if needed, let's keep original sorting (maybe id timestamp)
    items.sort((a, b) => b.id.localeCompare(a.id));
    onUpdate(items);
  });
};

export const savePortfolioItem = async (item: PortfolioItem) => {
  const docRef = doc(db, COLLECTION_NAME, item.id);
  await setDoc(docRef, item);
};

export const deletePortfolioItem = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

export const seedPortfolioIfEmpty = async () => {
  const collectionRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(collectionRef);
  if (snapshot.empty) {
    for (const item of PORTFOLIO_ITEMS) {
      await savePortfolioItem(item);
    }
  }
};
