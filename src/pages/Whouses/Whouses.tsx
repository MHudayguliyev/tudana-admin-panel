import React, {useState, useEffect, ChangeEvent} from 'react'
import { useQuery } from 'react-query'
import UploadWhouse from '@app/components/Modals/UploadWhouseModal/UploadWhouse'

/// styles 
import styles from './Whouses.module.scss'
/// not found icon
import errorIcon from '@app/assets/images/error.png'

import { Button, Col, Input, Paper, Preloader, Row, Table } from '@app/compLibrary'
import { getWhouses } from '@app/api/Queries/Getters'
import { WareHouseList } from '@app/api/Types/queryReturnTypes'
import { getBaseUrl } from '@utils/helpers'
import { DeleteWhouse } from '@app/api/Queries/Deletes'
import { toast } from 'react-hot-toast'
import DeleteConfirm from '@app/components/Modals/DeleteConfirm/DeleteConfirm'

/// selected data type 
import { SelectedDataType } from '@app/Types/SelectedData'

const Whouses = () => {

  /// queries 
  const {
    data: whouseDataList,
    refetch,
    isLoading, 
    isError
  } = useQuery('getWhouseData', () => getWhouses(), {
    refetchOnWindowFocus: false
  })

  /// states
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openDeleteForm, setDeleteForm] = useState<boolean>(false)
  const [selectedData, setSelectedData] = useState<SelectedDataType>({
    id: "",
    label: ""
  })
  const [whouseData, setWhouseData] = useState<WareHouseList[] | undefined>(whouseDataList)

  useEffect(() => {
    if(!isLoading && !isError){
      setWhouseData(whouseDataList)
    }
  }, [whouseDataList])

  function handleSearch <T extends WareHouseList[] >(event: ChangeEvent<HTMLInputElement>, data:T | any){
    const value = event.currentTarget.value?.toLowerCase();
    const result = [];

    for(let i = 0; i < data.length; i++){
      const whouse: any = data[i].warehouse_name
      if(whouse&&whouse.includes(value)){
        result.push({...data[i]})
      }
    }
    return result
  }

  return (
    <>
      <UploadWhouse 
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
            const response: any = await DeleteWhouse(id)
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
              onChange={e => setWhouseData(handleSearch(e, whouseDataList))}  
            />
          </div>
          <Button type='contained' color='theme' rounded onClick={() => setOpenModal(true)}>Add warehouse</Button>
        </div>

        <div className={styles.main__body}>
            {isLoading ? <div className={styles.loading}><Preloader /></div> : 
              isError ? 
              <div className={styles.notFound}>
                <img src={errorIcon}/>
              </div> : 
              whouseData?.length ? <Row rowGutter={5} colGutter={5}>
              {whouseData?.map((item, index: number) => (
                <Col grid={{sm: 12,md:6,lg:4, xlg: 3, xxlg: 3}} key={index}>
                  <div className={styles.each__partner}>
                    <div className={styles.image__container}>
                      <img src={`${getBaseUrl('whouse')}/${item.image_name}`} className={styles.image__itself}/>
                    </div>
                    <div className={styles.card__body}>
                      <h4>{item.warehouse_name}</h4>
                      <Button type='contained' rounded color='theme' onClick={() => {
                          setDeleteForm(true)
                          setSelectedData((prev) => ({...prev, id: item.image_guid}))
                      }}>Delete</Button>
                    </div>
                  </div>
                </Col>
              )) }
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

export default Whouses

{/* <Row rowGutter={5} colGutter={5}>
{isLoading ? <Preloader /> : whouseData ? 
whouseData?.map((item, index: number) => (
  <Col grid={{sm: 12,md:6,lg:4, xlg: 3, xxlg: 3}} key={index}>
    <div className={styles.each__partner}>
      <div className={styles.image__container}>
        <img src={`${getBaseUrl('whouse')}/${item.image_name}`} className={styles.image__itself}/>
      </div>
      <div className={styles.card__body}>
        <h4>{item.warehouse_name}</h4>
        <Button type='contained' rounded color='theme' onClick={() => deleteWhouse(item.image_guid)}>Delete</Button>
      </div>
    </div>
  </Col>
)) 
: 
<div className={styles.notFound}>
  <img src={errorIcon}/>
</div>  
}
</Row> */}