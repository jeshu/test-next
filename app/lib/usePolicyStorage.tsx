import { useState, useContext, createContext } from 'react';
import azure from 'azure-storage';
import { uid } from 'uid';
import { useRouter } from 'next/router';

const TABLE_NAME = 'Policies';
type PolicyStorageProps = {
  policyList: []
  policyData: any
  error: string
  fetch(policyId: string): null
  fetchAll(customerId: string): null
  insert(policyData: any, callback: Function): null
  update(policyId: string, policyData: any): null
}

const PolicyStorageContext = createContext<Partial<PolicyStorageProps>>({})

export function PolicyStorageProvider({ children }) {
  const _mPolicyData = useProvidePolicyStorage()
  return <PolicyStorageContext.Provider value={_mPolicyData}>{children}</PolicyStorageContext.Provider>
}
export const useInspectionStorage = () => {
  return useContext(InspectionStorageContext);
};

function dataParser(data: any) {
  const parsedData = {
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
  return parsedData;
};

const useProvidePolicyStorage = (): PolicyStorageProps => {
  const [policyList, setPolicyList] = useState(null);
  const [policyData, setPolicyData] = useState(null);
  const [error, setError] = useState('');

  const fetch = (policyId:string) => {
    setPolicyData(null)
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const tableQuery = new azure.TableQuery().where('policyId == ?string?', policyId)

    tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
      if (!error) {
        const parsedData = result.entries.map(dataParser);
        setPolicyData(parsedData[0])
      } else {
        setError(error.message)
      }
    });
  }
  const fetchAll = (customerId:string) => {
    setPolicyList(null)
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const tableQuery = new azure.TableQuery().where('customerId == ?string?', customerId)

    tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
      if (!error) {
        const parsedData = result.entries.map(dataParser);
        setPolicyList(parsedData)
      } else {
        setError(error.message)
      }
    });
  }
  const insert = (policyData:any, callback?:Function) => {
    setError('')
    const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    const entGen = azure.TableUtilities.entityGenerator;
    for (const key in policyData) {
      policyData[key] = entGen.String(policyData[key])
    }
    const policyId = uid()
    const task = {
      PartitionKey: entGen.String('Policy'),
      RowKey: entGen.String(uid(16)),
      policyId: entGen.String(policyId),
      ...policyData,
      policyAssociated: entGen.String(''),
    };
    tableService.insertEntity(TABLE_NAME, task, (error, result) => {
      if (!error) {
        // Entity inserted
        callback(policyId)

      } else {
        setError(error.message)
      }
    });
  }
  const update = (policyId:string, policyData:any) => {}


  return {
    policyData,
    policyList,
    error,
    fetch,
    fetchAll,
    insert,
    update
  }

}