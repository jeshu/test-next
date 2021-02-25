import { useState, useContext, createContext } from 'react';
import azure from 'azure-storage';
import {uid} from 'uid';

type DroanStorageProps = {
  data: []
  fetch(inspectionId: string): null
  insert(inspectionId: string): null
  update(data: any): null
}

const DroanStorageContext = createContext<Partial<DroanStorageProps>>({});

export function DroanStorageProvider({ children }) {
  const droanData = useProvideDroanStorage()
  return <DroanStorageContext.Provider value={droanData}>{children}</DroanStorageContext.Provider>
}
export const useDroanStorage = () => {
  return useContext(DroanStorageContext);
};

function dataParser(data: any) {
  const parsedData = {
    id: uid()
  };
  for (const key in data) {
    if(key.toLowerCase().search(/(rowkey)|(partitionkey)|(.metadata)/) === -1) {
      if(data[key]['$'] === 'Edm.DateTime') {
        parsedData[key] = data[key]['_'].toLocaleString()
      } else {
        parsedData[key] = data[key]['_'];
      }
    }
  }
  return parsedData;
};

function useProvideDroanStorage() {

  const [droanData, setDroanData] = useState(null);
  const [error, setError] = useState('');

  const fetch = () => {
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const tableQuery = new azure.TableQuery().top(10)

    tableService.queryEntities('Field', tableQuery, null, function (error, result, response) {
      if (!error) {
        const parsedData = result.entries.map(dataParser);
        console.log(parsedData);
        
        setDroanData(parsedData)
      }
    });
  }
  const insert = () => {

  }
  const update = () => {

  }
  return {
    data: droanData,
    error,
    fetch,
    insert,
    update,

  }
}