import React, {useState, useEffect, ChangeEvent} from 'react'
import { useQuery } from 'react-query'
import { Button, Col, Input, Paper, Preloader, Row } from '@app/compLibrary'

//// styles
import styles from './Partners.module.scss'
/// not found icon
import errorIcon from '@app/assets/images/error.png'

import UploadPartnerModal from '@app/components/Modals/UploadPartnerModal/UploadPartnerModal'
import { getPartners } from '@app/api/Queries/Getters'
import { getBaseUrl } from '@utils/helpers'
import { DeletePartner } from '@app/api/Queries/Deletes'
import toast from 'react-hot-toast'
import { PartnerType } from '@app/api/Types/queryReturnTypes/Partner'

/// selected data type 
import { SelectedDataType } from '@app/Types/SelectedData'
import DeleteConfirm from '@app/components/Modals/DeleteConfirm/DeleteConfirm'

const Partners = () => {


  //// queries
  const {
    data: partnersDataList,
    isLoading, 
    isError,
    refetch
  } = useQuery('getPartners',() => getPartners(), {
    refetchOnWindowFocus: false
  })

  /// states
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openDeleteForm, setDeleteForm] = useState<boolean>(false)
  const [partnersData, setPartnersData] = useState(partnersDataList)
  const [selectedData, setSelectedData] = useState<SelectedDataType>({
    id: "",
    label: ""
  })

  
  useEffect(() => {
    if(!isLoading && !isError){
      setPartnersData(partnersDataList)
    }
  }, [partnersDataList])

  function handleSearch <T extends PartnerType[] >(event: ChangeEvent<HTMLInputElement>, data:T | any){
    const value = event.currentTarget.value?.toLowerCase();
    const result = [];

    for(let i = 0; i < data.length; i++){
      const partner: any = data[i].partner_name
      console.log('partner', partner)
      if(partner.includes(value)){
        result.push({...data[i]})
      }
    }
    console.log('res', result)
    return result
  }

  return (
    <>
      <UploadPartnerModal 
        show={openModal}
        setShow={setOpenModal}
        onSuccess={refetch}
      />

      <DeleteConfirm
        show={openDeleteForm}
        setShow={setDeleteForm}
        onDelete={async (data) => {
          const {id} = data
          try {
            const response: any = await DeletePartner(id)
            if(response.status === 200){
              setDeleteForm(false)
              toast.success(response.message)
              refetch()
            }
          } catch (error) {
            console.log(error)
          }
        }}
        onCancel={() => setDeleteForm(false)}
        selectedData={selectedData}
      />

      <div className={styles.upload__part}>
        <div className={styles.inputInner}>
            <Input 
              style={{width: '400px'}}
              autoComplete='off'
              fontWeight='bold'
              fontSize='big'  
              type='search'   
              placeholder='Search product'
              onChange={e => setPartnersData(handleSearch(e, partnersDataList))}  
            />
          </div>
        <Button type='contained' color='theme' rounded onClick={() => setOpenModal(true)}>Add partner</Button>
      </div>

        <div className={styles.card__container}>
          {isLoading ? <div className={styles.loading}><Preloader /></div> : 
          isError ? 
          <div className={styles.notFound}>
            <img src={errorIcon}/>
          </div> : 
          partnersData?.length ?           
          <Row rowGutter={5} colGutter={5}>
          {partnersData?.map((item, index: number) => (
           <Col grid={{sm: 12,md:6,lg:4, xlg: 3, xxlg: 3}} key={index}>
             <div className={styles.each__partner}>
               <div className={styles.image__container}>
                 <img src={`${getBaseUrl('partner')}/${item.image_name}`} className={styles.image__itself}/>
               </div>
               <div className={styles.card__body}>
                 <h4>{item.partner_name}</h4>
                 <Button type='contained' rounded color='theme' onClick={() => {
                   setDeleteForm(true)
                   setSelectedData((prev) => ({...prev, id: item.image_guid}))
                 }}>Delete</Button>
               </div>
             </div>
           </Col>
          ))}
          </Row>
          :
          <div className={styles.notFound}>
            <img src={errorIcon}/>
          </div>
          }
        </div>
    </>
  )
}

export default Partners

{/* 
{isLoading ?  : partnersData ? 
partnersData?.map((item, index: number) => (
  <Col grid={{sm: 12,md:6,lg:4, xlg: 3, xxlg: 3}} key={index}>
    <div className={styles.each__partner}>
      <div className={styles.image__container}>
        <img src={`${getBaseUrl('partner')}/${item.image_name}`} className={styles.image__itself}/>
      </div>
      <div className={styles.card__body}>
        <h4>{item.partner_name}</h4>
        <Button type='contained' rounded color='theme' onClick={() => deletePartner(item.image_guid)}>Delete</Button>
      </div>
    </div>
  </Col>
)) 
: 
}
</Row> */}