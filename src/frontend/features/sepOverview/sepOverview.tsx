import React, {useEffect} from 'react'
import {
    useGetSepQuery,
    useFindSepsQuery,
    useLazyGetSepExtendedQuery
} from '../../services/sepSlice'

const SepOverview = () => {

    const {data:seps, isSuccess} = useFindSepsQuery()
    
    useEffect(() => {
        console.log("🚀 ~ file: SepOverview.tsx ~ line 11 ~ SepOverview ~ seps", seps)
    }, [isSuccess])
    
  return (
    <div>SepOverview</div>
  )
}

export default SepOverview