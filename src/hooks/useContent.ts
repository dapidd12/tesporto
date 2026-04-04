import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'profile'), (doc) => {
      if (doc.exists()) {
        setProfile({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/profile');
    });
    return () => unsubscribe();
  }, []);

  return { profile, loading };
}

export function useCollection(collectionName: string, orderField: string = 'createdAt') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy(orderField, 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, collectionName);
    });
    return () => unsubscribe();
  }, [collectionName, orderField]);

  return { data, loading };
}
