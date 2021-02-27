const PREMIUM_RATE = 2
const LOW_QUALITY_ADJUSTMENT = 0.5

export const calculatePreHarvest = (data: any, preInspectionIDV) => {
  const _Cultivatedland = parseFloat(data.Cultivatedland);
  let idv = preInspectionIDV * _Cultivatedland / 100;
  let premium = (PREMIUM_RATE / 100) * idv;
  return { IDV: idv, premium }
}

export const calculatePostHarvest = (data: any, sumAssured) => {
  const _HighQualityCrop = parseFloat(data.HighQualityCrop)
  const _LowQualityCrop = parseFloat(data.LowQualityCrop)
  const _sum = parseFloat(sumAssured);
  let idv = (_sum * _HighQualityCrop / 100) +
    (_sum * _LowQualityCrop / 100) * LOW_QUALITY_ADJUSTMENT;
  return { IDV: idv }
}

export const averageFieldData = (data: any = []) => {
  const processData = data.reduce((acc = [], row: any) => {
    for (let key in row) {
      if (row[key] && !isNaN(row[key])) {
        if (!acc[key]) {
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
  for (let key in processData) {
    if (processData[key] && !isNaN(processData[key])) {
      processData[key] = (processData[key] / len).toFixed(2);
    }
  }
  return processData
}