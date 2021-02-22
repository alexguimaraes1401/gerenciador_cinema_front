import { React, useState} from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, Modal } from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
    tableOverflow: {
        overflow: 'auto'
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 800,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paperModal: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

function SystemModal(props) {
    const classes = useStyles();
    const [openModal, setOpenModal] = useState(false);

    const history = useHistory();

    function handleCloseModal(){
        setOpenModal(false);
        handleRedirectFilmes();
    }

    function handleRedirectFilmes() {
        history.push('#/app/filmes');
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModal}
            //onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={openModal}>
                <div className={classes.paperModal}>
                    <h2 id="transition-modal-title">{props.modalTitle}</h2>
                    <p id="transition-modal-description">{props.modalMsg}</p>
                    <br />
                    <Button variant="contained" color="default" onClick={handleCloseModal}>OK</Button>
                </div>
            </Fade>
        </Modal>
    );
}

SystemModal.propTypes = {
    openModal: PropTypes.bool, 
    modalTitle: PropTypes.string, 
    modalMsg: PropTypes.string,
    modalBackUrl: PropTypes.string
};

export default SystemModal;