const PREMIUM_RATE = 2
const LOW_QUALITY_ADJUSTMENT = 0.5

export const calculatePreHarvest = (data:any, preInspectionIDV) => {
  console.log(data, preInspectionIDV);

  const _Cultivatedland = parseFloat(data.Cultivatedland);
  const _preInspectionIDV = preInspectionIDV
  
  console.log(_Cultivatedland, preInspectionIDV);
  
  let idv = preInspectionIDV * _Cultivatedland/100; 
  let premium = (PREMIUM_RATE/100) * idv;
  return { idv, premium, claimAmount:idv}
}

export const calculatePostHarvest = (data:any, sumAssured) => {
  console.log(data, sumAssured);
  
  const _HighQualityCrop = data._HighQualityCrop
  const _LowQualityCrop = data._LowQualityCrop

  let idv = (sumAssured * _HighQualityCrop/100) +  
            (sumAssured * _LowQualityCrop/100)*LOW_QUALITY_ADJUSTMENT; 
  return { claimAmount:idv}
}

export const averageFieldData = (data:any = []) => {
  const processData = data.reduce((acc = [], row:any) =>{
    for(let key in row) {
      if(row[key] && !isNaN(row[key])) {
        if(!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += parseFloat(row[key]);
      } else {
        acc[key] = ''
      }
    }
    return acc
  }, [])
  const len = data.length
  for(let key in processData) {
    if(processData[key] && !isNaN(processData[key])) {
      processData[key] = (processData[key]/len).toFixed(2); 
    }
  }
  console.log(processData);
  
  return processData
}