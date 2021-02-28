import { useState, useContext, createContext } from 'react';
import azure from 'azure-storage';
import { uid } from 'uid';

type DroneStorageProps = {
  data: []
  error: string
  clearData(): void
  fetch(customerId: string, inspectionId: string): void
  insert(inspectionData: any): void
  update(inspectionData: any): void
}

const DroneStorageContext = createContext<Partial<DroneStorageProps>>({});

export function DroneStorageProvider({ children }) {
  const droanData = useProvideDroneStorage()
  return <DroneStorageContext.Provider value={droanData}>{children}</DroneStorageContext.Provider>
}
export const useDroneStorage = () => {
  return useContext(DroneStorageContext);
};

function dataParser(data: any) {
  const parsedData: any = {
    id: uid()
  };
  for (const key in data) {
    if (key.toLowerCase().search(/(rowkey)|(partitionkey)|(.metadata)/) === -1) {
      if (data[key]['$'] === 'Edm.DateTime') {
        parsedData[key] = data[key]['_'].toLocaleString()
      } else {
        parsedData[key] = data[key]['_'];
      }
    }
  }
  delete parsedData.customerId;
  delete parsedData.inspectionId;
  return parsedData;
};

function useProvideDroneStorage():DroneStorageProps {

  const [droanData, setDroneData] = useState(null);
  const [error, setError] = useState('');


  function clearData() {
    setDroneData(null);
  }

  const fetch = (customerId: string, inspectionId: string) => {
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const tableQuery = new azure.TableQuery()
      .where('PartitionKey == ?string?', `${customerId}-${inspectionId}`)

    tableService.queryEntities('Field', tableQuery, null, function (error, result, response) {
      if (!error) {
        const parsedData = result.entries.map(dataParser);
        setDroneData(parsedData)
      } else {
        setError(error.message)
      }
    });
  }
  const insert = (inspectionData: any) => {
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const entGen = azure.TableUtilities.entityGenerator;
    const partitionkey = `${inspectionData.customerId}-${inspectionData.inspectionId}`
    if(inspectionData.inspectionId) {
      for (const key in inspectionData) {
        inspectionData[key] = entGen.String(inspectionData[key])
      }
      const inspectionId = uid()
      const task = {
        PartitionKey: entGen.String(partitionkey),
        RowKey: entGen.String(uid(16)),
        inspectionId: entGen.String(inspectionId),
        ...inspectionData,
        policyAssociated: entGen.String(''),
      };
      tableService.insertEntity('Field', task, (error, result) => {
        if (!error) {
          // Entity inserted
  
        } else {
          setError(error.message)
        }
      });
    }
  }
  const update = (data: any) => {

  }
  return {
    data: droanData,
    error,
    fetch,
    insert,
    update,
    clearData,
  }
}