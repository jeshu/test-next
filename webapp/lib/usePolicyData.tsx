import { useState, useContext, createContext } from 'react';
// import azure from 'azure-storage';
import { uid } from 'uid';
import { useRouter } from 'next/router';
import axios from 'axios';

const TABLE_NAME = 'Policies';
type PolicyStorageProps = {
  policyList: []
  policyData: any
  error: string
  fetch(policyId: string): void
  fetchAll(customerId: string): void
  insert(policyData: any, callback: Function): void
  saveClaim(claimData: any,callback: Function): void
}

const PolicyStorageContext = createContext<Partial<PolicyStorageProps>>({})

export function PolicyStorageProvider({ children }) {
  const _mPolicyData = useProvidePolicyStorage()
  return <PolicyStorageContext.Provider value={_mPolicyData}>{children}</PolicyStorageContext.Provider>
}
export const usePolicyStorage = () => {
  return useContext(PolicyStorageContext);
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
    setPolicyData(null);
    setError('');
    
    axios.get(`${process.env.NEXT_PUBLIC_POLICY_SERVICE}/policy/get/${policyId}`)
    .then((response) => {
      const parsedData = response.data; //result.entries.map(dataParser);
        setPolicyData(parsedData[0])
    }).catch((error)=>{
        setError(error.message)
    });



    // const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    // const tableQuery = new azure.TableQuery().where('policyId == ?string?', policyId)

    // tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
    //   if (!error) {
    //     const parsedData = result.entries.map(dataParser);
    //     setPolicyData(parsedData[0])
    //   } else {
    //     setError(error.message)
    //   }
    // });
  }
  const fetchAll = (customerId:string) => {
    setPolicyList(null)
    setError('')
    
    axios.get(`${process.env.NEXT_PUBLIC_POLICY_SERVICE}/policy/get/`)
    .then((response) => {
      const parsedData = response.data; //result.entries.map(dataParser);
      setPolicyList(parsedData)
    }).catch((error)=>{
        setError(error.message)
    });

    // const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
    // const tableQuery = new azure.TableQuery().where('customerId == ?string?', customerId)

    // tableService.queryEntities(TABLE_NAME, tableQuery, null, function (error, result) {
    //   if (!error) {
    //     const parsedData = result.entries.map(dataParser);
    //     setPolicyList(parsedData)
    //   } else {
    //     setError(error.message)
    //   }
    // });
  }
  const insert = (policyData:any, callback?:Function) => {
    setError('');

    const policyId = uid();
    policyData['policyId'] = policyId
    axios.post(`${process.env.NEXT_PUBLIC_POLICY_SERVICE}/policy/save`, policyData)
    .then((response) => {
      callback(policyId)
    }).catch((error)=>{
        setError(error.message)
    });
  }
  const saveClaim = (claimData:any, callback?: Function) => {
    setError('')
    axios.post(`${process.env.NEXT_PUBLIC_POLICY_SERVICE}/policy/claim`, claimData)
    .then((response) => {
      callback(response)
    }).catch((error)=>{
        setError(error.message)
    });
  }


  return {
    policyData,
    policyList,
    error,
    fetch,
    fetchAll,
    insert,
    saveClaim
  }

}