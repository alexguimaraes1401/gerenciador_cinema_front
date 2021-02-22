import { React, useState, useEffect } from "react";
import { Grid, Button, TextField, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import { CloudUpload } from "@material-ui/icons";

var displayImage = false;

const useStyles = makeStyles(theme => ({
    tableOverflow: {
        overflow: 'auto'
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 800,
    },
    imagem: {
        display: { displayImage }
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

function UpdateFilme(props) {
    const classes = useStyles();

    const [imageFile, setImageFile] = useState('');
    const [descricao, setDescricao] = useState('');
    const [titulo, setTitulo] = useState('');
    const [duracao, setDuracao] = useState('');
    const [carregarFilme, setCarregarFilme] = useState(true)
    const [Id, setId] = useState('')
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMsg, setModalMsg] = useState('');

    const history = useHistory();

    useEffect(() => {
        if (carregarFilme) {

            setId(props.filme.Id);
            setTitulo(props.filme.Titulo);
            setDescricao(props.filme.Descricao);
            setDuracao(props.filme.Duracao);
            setImageFile(props.filme.Imagem);

            setCarregarFilme(false);
        }
    }, [carregarFilme, props]);


    function handlerDisplayChange(e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            setImageFile(reader.result);

        }, false);

        if (file) {
            reader.readAsDataURL(file);
            displayImage = true;
        }
    };

    function handleSubmit(e) {
        e.preventDefault();

        var filme = {
            "Id": Id,
            "Titulo": titulo,
            "Descricao": descricao,
            "Duracao": duracao,
            "Imagem": imageFile
        }

        filme = JSON.stringify(filme);

        var config = {
            method: 'post',
            url: 'http://localhost:60700/api/filme/alterar-filme',
            headers: {
                'Content-Type': 'application/json'
            },
            data: filme
        };

        axios(config)

            .then(res => {
                const filme = res.data;

                if (filme.ok === true) {

                    setModalTitle('Filme');
                    setModalMsg('Filme atualizado com sucesso!');

                    handleOpenModal();
                }

            }).catch(err => {
                console.log(err);
            });
    }

    function handleOpenModal() {
        setOpenModal(true);
    }

    function handleCloseModal() {
        setOpenModal(false);
        handleRedirectFilmes();
    }

    function handleRedirectFilmes() {
        history.push("/app/filmes");
    }

    function handleDuracaoChange(e) {
        setDuracao(e.target.value);
    }

    function handleTituloChange(e) {
        setTitulo(e.target.value);
    }

    function handleDescricaoChange(e) {
        setDescricao(e.target.value);
    }
    return (
        <>
            <form lassName={classes.root} autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    id="titulo"
                    label="Título"
                    placeholder="Título do Filme"
                    required
                    fullWidth="true"
                    onChange={handleTituloChange}
                    value={titulo}
                />
                <br />
                <br />
                <TextField
                    id="descricao"
                    label="Descrição"
                    placeholder="Descrição do filme"
                    multiline
                    rowsMax={5}
                    rows={5}
                    required
                    fullWidth="true"
                    onChange={handleDescricaoChange}
                    value={descricao}
                />
                <br />
                <br />
                <TextField
                    id="duração"
                    label="Duração"
                    type="time"
                    placeholder="Duração do filme"
                    required
                    fullWidth="true"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleDuracaoChange}
                    value={duracao}
                />
                <br />
                <br />
                <TextField
                    id="imagem"
                    label="Imagem"
                    accept="image/*"
                    type="file"
                    placeholder="Imagem do filme"
                    fullWidth="true"
                    onChange={handlerDisplayChange}
                    style={{ display: 'none' }}
                />

                <label htmlFor="imagem">
                    <Button
                        color="secondary"
                        variant="contained"
                        component="span"
                        startIcon={
                            <CloudUpload />
                        }
                    >
                        Imagem do Filme
                    </Button>
                </label>
                <br />
                <br />
                <img id="imagem" src={imageFile} height={imageFile ? "200" : "0"} alt="" className={classes.imagem} />
                <br />
                <br />
                <Grid justfyContent="center" alignItems="flex-end">
                    <Button type="submit" variant="contained" color="primary" >Salvar</Button>&nbsp;&nbsp;
                    <Button variant="contained" color="default" onClick={handleRedirectFilmes}>Cancelar</Button>
                </Grid>
            </form>
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
                        <h2 id="transition-modal-title">{modalTitle}</h2>
                        <p id="transition-modal-description">{modalMsg}</p>
                        <br />
                        <Button variant="contained" color="default" onClick={handleCloseModal}>OK</Button>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

UpdateFilme.prototype = {
    filme: PropTypes.object.isRequired
}

export default UpdateFilme;
