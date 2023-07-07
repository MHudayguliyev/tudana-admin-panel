import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, SizedBox, TextArea } from '@app/compLibrary';
import toast from 'react-hot-toast';

///  styles
import styles from './Aboutus.module.scss'
import { updateAboutus } from '@app/api/Queries/Post';


type FormikValues = {
  tm: string, 
  ru: string, 
  en: string
}

const Aboutus = () => {
  const formik = useFormik<FormikValues>({
    initialValues: {
      tm: "",
      ru: "",
      en: ""
    },
    validationSchema: Yup.object({
      tm: Yup.string().min(25).required(),
      ru: Yup.string().min(25).required(),
      en: Yup.string().min(25).required()
    }),
    onSubmit: async (values, {resetForm}) => {
      console.log(values)
      try {
        const res: any = await updateAboutus(values)
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
      <form onSubmit={formik.handleSubmit} className={styles.the__form}>
        <div className={styles.main__body}>
        <div className={styles.expandArea}>
          <TextArea 
            maxLength={1000}
            cols={100} rows={3}
            placeholder='Tm'
            name='tm'
            value={formik.values.tm}
            onChange={formik.handleChange}
          />
        </div>
        <div className={styles.expandArea}>
          <TextArea 
            maxLength={1000}
            cols={100} rows={3}
            placeholder='En'
            name='ru'
            value={formik.values.ru}
            onChange={formik.handleChange}
          />
        </div>
        <div className={styles.expandArea}>
          <TextArea 
            maxLength={1000}
            cols={100} rows={3}
            placeholder='Ru'
            name='en'
            value={formik.values.en}
            onChange={formik.handleChange}
          />
        </div>

        <SizedBox height={10}/>
        <div className={styles.form__footer}>
          <Button type='contained' rounded htmlType='submit' color='theme' style={{width: '400px', display: 'flex', justifyContent: 'center', borderRadius: '15px'}}>Save</Button>
        </div>
        </div>
      </form>
    </>
  )
}

export default Aboutus