import { useState, useContext, createContext } from 'react';
import azure from 'azure-storage';
import {uid} from 'uid';
import { useRouter } from 'next/router';

const TABLE_NAME = 'Inspection';
type InspectionStorageProps = {
  list: []
  inspectionData: any
  error: string
  fetch(inspectionId: string): null
  fetchAll(customerId: string, policyId?: string): null
  insert(inspectionData: any): null
  update(inspectionData: any): null
}

const InspectionStorageContext = createContext<Partial<InspectionStorageProps>>({});

export function InspectionStorageProvider({ children }) {
  const InspectionData = useProvideInspectionStorage()
  return <InspectionStorageContext.Provider value={InspectionData}>{children}</InspectionStorageContext.Provider>
}
export const useInspectionStorage = () => {
  return useContext(InspectionStorageContext);
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

function useProvideInspectionStorage() {
  const router = useRouter();
  const [list, setList] = useState(null);
  const [inspectionData, setInspectionData] = useState(null);
  const [error, setError] = useState('');

  
  const fetch = (userId:string) => {
    setError('')
    setInspectionData(null)
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const tableQuery = new azure.TableQuery().where('userId == ?string?', userId)

    tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
      if (!error) {
        const parsedData = result.entries.map(dataParser);
        setInspectionData(parsedData[0])

      } else {
        setError(error.message)
      }
    });
  }

  const fetchAll = (customerId: string, policyId?: string) => {
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const tableQuery = policyId ? new azure.TableQuery()
        .where('customerId == ?string? && policyId == ?string?', customerId, policyId) 
        : new azure.TableQuery()
          .where('customerId == ?string?', customerId) 

    tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
      if (!error) {
        const parsedData = result.entries.map(dataParser);
        setList(parsedData)

      } else {
        setError(error.message)
      }
    });
  }

  const insert = (inspectionData:any) => {
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const entGen = azure.TableUtilities.entityGenerator;
    for (const key in inspectionData) {
      inspectionData[key] = entGen.String(inspectionData[key])
    }
    const task = {
      PartitionKey: entGen.String('users'),
      RowKey: entGen.String(uid(16)),
      userId: entGen.String(uid()),
      ...inspectionData,
      inspectionPending: entGen.String('true'),
      policyAssociated: entGen.String(''),
      inspectionAssociated: entGen.String('')
    };
    tableService.insertEntity(TABLE_NAME, task,  (error, result) => {
      if(!error){
        // Entity inserted
        router.push('/Inspections');
      } else {
        setError(error.message)
      }
    });
  }
  const update = (data:any) => {

  }

  return {
    list,
    inspectionData,
    error,
    fetch,
    fetchAll,
    insert,
    update,

  }
}