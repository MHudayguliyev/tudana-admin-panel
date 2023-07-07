import React from "react";
import styles from "./DeleteConfirm.module.scss";
import { Button, Modal } from "@app/compLibrary";
import CommonModalI from "./../commonTypes";

type SelectedDataType = {
  id: string, 
  label: string
}

interface DeleteConfirmInterface extends CommonModalI {
  selectedData: SelectedDataType,
  onDelete: (data:SelectedDataType) => void;
  onCancel: () => void
}

const DeleteConfirm = (props: DeleteConfirmInterface) => {
  const { show, setShow, selectedData, onDelete, onCancel } = props;

  return (
    <Modal
      isOpen={show}
      className={styles.delModal}
      close={() => setShow(false)}
    >
      <div>
        <p className={styles.bodyTxt}>Are you sure?</p>
        <div className={styles.buttonsWrap}>
        <Button
            color="grey"
            rounded
            onClick={() => {
              setShow(false);
              onCancel()
            }}
          >
            No
          </Button>
          <Button
            color="theme"
            rounded
            onClick={() => onDelete(selectedData)}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;
