import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@app/hooks/redux_hooks';
import styles from './ClientsPage.module.scss';
import { useQuery } from 'react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Input, Pagination, Paper, Preloader, Row, SizedBox, TextArea } from '@app/compLibrary';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { updateStatistics } from '@app/api/Queries/Post';


type FormikValues = {
  client_count: string, 
  delivery_count: string,
  rating: string
}

const ClientsPage = () => {
    const { t } = useTranslation()

    const formik = useFormik<FormikValues>({
      initialValues: {
        client_count: "", 
        delivery_count:"", 
        rating: ""
      },
      validationSchema: Yup.object({
        client_count: Yup.number().nullable(),
        delivery_count: Yup.number().nullable(),
        rating: Yup.number().nullable()
      }),
      onSubmit: async(values: any, {resetForm}) => {
        try {
          const {client_count,delivery_count,rating} = values
          if(!client_count && !delivery_count && !rating){
            return toast.error('Fill at least on field.')
          }
          const res: any = await updateStatistics(values)
          console.log('response', res)
          if(res.status === 200){
            toast.success(res.message)
            resetForm()
          }
          
        } catch (error) {
          console.log(error)
        }
      }
    })

    return (
        <>
          <div className={styles.client__container}>
            <div className={styles.form__control}>
            <form className={styles.the__form} onSubmit={formik.handleSubmit}>
              <label className={styles.input__label}>Client count</label>
              <Paper rounded removeShadow>
              <div className={styles.inputInner}>
                <Input 
                  name='client_count'
                  type='number'
                  autoComplete='off'
                  fontWeight='bold'
                  fontSize='big'
                  placeholder='Enter count..'
                  style={{width: '400px'}}
                  value={formik.values.client_count}
                  onChange={formik.handleChange}
                />
              </div>
              </Paper>
              <SizedBox height={15}/>
              <label className={styles.input__label}>Delivery count</label>
              <Paper rounded removeShadow>
              <div className={styles.inputInner}>
                <Input 
                  name='delivery_count'
                  type='number'
                  autoComplete='off'
                  fontWeight='bold'
                  fontSize='big'
                  placeholder='Enter count..'
                  style={{width: '400px'}}
                  value={formik.values.delivery_count}
                  onChange={formik.handleChange}
                />
              </div>
              </Paper>
              <SizedBox height={15}/>
              <label className={styles.input__label}>Rating</label>
              <Paper rounded removeShadow>
              <div className={styles.inputInner}>
                <Input 
                  name='rating'
                  type='number'
                  autoComplete='off'
                  fontWeight='bold'
                  fontSize='big'
                  placeholder='Enter count..'
                  style={{width: '400px'}}
                  value={formik.values.rating}
                  onChange={formik.handleChange}
                />
              </div>
              </Paper>
              <SizedBox height={15}/>
              <div className={styles.form__footer}>
                <Button type='contained' rounded htmlType='submit' color='theme' style={{width: '400px', display: 'flex', justifyContent: 'center', borderRadius: '15px'}}>Save</Button>
              </div>
            </form>
            </div>
          </div>
        </>
    )
}

export default ClientsPage

// 
