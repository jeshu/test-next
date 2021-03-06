import { useState, useContext, createContext } from 'react';
import azure from 'azure-storage';
import {uid} from 'uid';
import { useRouter } from 'next/router';

const TABLE_NAME = 'Users';
type CustomerStorageProps = {
  data: []
  userData: any
  error: string
  fetch(userId: string): void
  fetchAll(): void
  insert(userData: any): void
  update(userId:string, data: any): void
}

const CustomerStorageContext = createContext<Partial<CustomerStorageProps>>({});

export function CustomerStorageProvider({ children }) {
  const customerData = useProvideCustomerStorage()
  return <CustomerStorageContext.Provider value={customerData}>{children}</CustomerStorageContext.Provider>
}
export const useCustomerStorage = () => {
  return useContext(CustomerStorageContext);
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

function useProvideCustomerStorage(): CustomerStorageProps {
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  
  const fetch = (userId:string) => {
    setError('')
    setUserData(null)
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const tableQuery = new azure.TableQuery().where('userId == ?string?', userId)

    tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
      if (!error) {
        const parsedData = result.entries.map(dataParser);
        setUserData(parsedData[0])

      } else {
        setError(error.message)
      }
    });
  }

  const fetchAll = () => {
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const tableQuery = new azure.TableQuery().top(20)

    tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
      if (!error) {
        const parsedData = result.entries.map(dataParser);
        setCustomerData(parsedData)

      } else {
        setError(error.message)
      }
    });
  }

  const insert = (userData:any) => {
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const entGen = azure.TableUtilities.entityGenerator;
    for (const key in userData) {
      userData[key] = entGen.String(userData[key])
    }
    const task = {
      PartitionKey: entGen.String('users'),
      RowKey: entGen.String(uid(16)),
      userId: entGen.String(uid()),
      ...userData,
      inspectionPending: entGen.String('true'),
      policyAssociated: entGen.String(''),
      inspectionAssociated: entGen.String('')
    };
    tableService.insertEntity(TABLE_NAME, task,  (error, result) => {
      if(!error){
        // Entity inserted
        router.push('/customer');
      } else {
        setError(error.message)
      }
    });
  }
  const update = (userId:string, data:any) => {
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const entGen = azure.TableUtilities.entityGenerator;
    const tableQuery = new azure.TableQuery()
      .where('userId == ?string?', userId)

    tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
      if (!error) {
        const task = result.entries[0]
        for(const key in data) {
          task[key] = entGen.String(`${data[key]}`);
        }
        tableService.replaceEntity(TABLE_NAME, task, (error, result) => {
          if (!error) {
            console.log('value updated')
          } else {
            setError(error.message)
          }
        });
      } else {
        setError(error.message)
      }
    });
  }

  return {
    data: customerData,
    userData,
    error,
    fetch,
    fetchAll,
    insert,
    update,

  }
}