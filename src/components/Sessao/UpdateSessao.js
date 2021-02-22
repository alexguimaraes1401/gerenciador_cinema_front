import { React, useState, useEffect } from "react";
import { Grid, Button, TextField, Modal, Select, MenuItem, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Autocomplete } from '@material-ui/lab';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import PropTypes from 'prop-types';

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

function UpdateSessao(props) {
    const classes = useStyles();

    const [horario, setHorario] = useState('');
    const [data, setData] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMsg, setModalMsg] = useState('');
    const [valorIngresso, setValorIngresso] = useState('');
    const [sala, setSala] = useState('');
    const [filme, setFilme] = useState('');
    const [lstFilmes, setlstFilmes] = useState([]);
    const [lstSalas, setlstSalas] = useState([]);
    const [tipoAnimacao, setTipoAnimacao] = useState('');
    const [tipoAudio, setTipoAudio] = useState('');
    const [Id, setId] = useState('');
    const [carregarSessao, setCarregarSessao] = useState(true)

    const history = useHistory();

    useEffect(() => {
        if (carregarSessao) {

            handleGetSessao(props.sessao);

            setCarregarSessao(false);
        }
    }, [carregarSessao, props]);

    function handleGetSessao(sessao) {
        axios.get('http://localhost:60700/api/sessao/get-sessao',
            {
                params: {
                    Id: sessao.Id
                }
            }
        )
            .then(res => {
                let ses = res.data;

                if (ses.ok === true) {
                    setId(ses.data.id);
                    setFilme(ses.data.filme);
                    setSala(ses.data.sala);
                    setTipoAnimacao(ses.data.tipoAnimacao);
                    setTipoAudio(ses.data.tipoAudio);
                    setData(ses.data.data);
                    setHorario(ses.data.horario);
                    setValorIngresso(ses.data.valorIngresso);
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
        handleRedirectSessoes();
    }

    function handleRedirectSessoes() {
        history.push('/app/sessoes');
    }

    useEffect(() => {
        handleListFilmes();
        handleListSalas();
    }, []);

    function handleListFilmes() {
        axios.get('http://localhost:60700/api/filme/listar-filmes')
            .then(res => {
                const filmes = res.data;

                if (filmes.ok === true) {
                    setlstFilmes(filmes.data);
                }

            }).catch(err => {
                console.log(err);
            });
    }

    function handleListSalas() {
        axios.get('http://localhost:60700/api/sala/listar-salas')
            .then(res => {
                const salas = res.data;

                if (salas.ok === true) {
                    setlstSalas(salas.data);
                }

            }).catch(err => {
                console.log(err);
            });
    }

    function handleSubmit(e) {
        e.preventDefault();

        var sessao = {
            "Id": Id,
            "Data": data,
            "Horario": horario,
            "valorIngresso": valorIngresso,
            "tipoAnimacao": "" + tipoAnimacao + "",
            "tipoAudio": "" + tipoAudio + "",
            "sala": "" + sala + "",
            "filme": "" + filme + ""
        }

        sessao = JSON.stringify(sessao);

        var config = {
            method: 'post',
            url: 'http://localhost:60700/api/sessao/alterar-sessao',
            headers: {
                'Content-Type': 'application/json'
            },
            data: sessao
        };

        axios(config)

            .then(res => {
                const sessao = res.data;

                if (sessao.ok === true) {

                    setModalTitle('Sessão');
                    setModalMsg('Sessão alterada com sucesso!');

                    handleOpenModal();
                }

            }).catch(err => {
                console.log(err);
            });
    }

    function handleDataChange(e) {
        setData(e.target.value);
    }

    function handleHorarioChange(e) {
        setHorario(e.target.value);
    }

    function handleValorIngressoChange(e) {
        setValorIngresso(e.target.value);
    }

    function handleTipoAnimacaoChange(e) {
        setTipoAnimacao(e.target.value);
    }

    function handleTipoAudio(e) {
        setTipoAudio(e.target.value);
    }

    function handleSalaChange(e, value) {
        setSala(value.id);
    }

    function handleFilmeChange(e, value) {
        setFilme(value.id);
    }

    return (
        <>
            <form lassName={classes.root} autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    id="data"
                    label="Data"
                    placeholder="Data da Sessão"
                    type="date"
                    required
                    height="300"
                    fullWidth="true"
                    value={data}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleDataChange}
                />
                <br />
                <br />
                <TextField
                    id="horario"
                    label="Horário"
                    placeholder="Horário da sessão"
                    type="time"
                    required
                    fullWidth="true"
                    value={horario}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleHorarioChange}
                />
                <br />
                <br />
                <CurrencyTextField
                    id="valoringresso"
                    label="Valor Ingresso"
                    variant="standard"
                    currencySymbol="R$"
                    outputFormat="string"
                    decimalCharacter=","
                    digitGroupSeparator="."
                    required
                    fullWidth="true"
                    value={valorIngresso}
                    onChange={handleValorIngressoChange}
                />
                <br />
                <br />
                <InputLabel id="tipoanimacao" required>Tipo de Animação</InputLabel>
                <Select
                    id="tipoanimacao"
                    label="Tipo de animação"
                    variant="standard"
                    required
                    fullWidth="true"
                    onChange={handleTipoAnimacaoChange}
                    value={tipoAnimacao}
                    InputLabelProps={{
                        shrink: true,
                    }}
                >
                    <MenuItem value={0}>2D</MenuItem>
                    <MenuItem value={1}>3D</MenuItem>
                </Select>
                <br />
                <br />
                <InputLabel id="tipoaudio" required>Tipo de Audio</InputLabel>
                <Select
                    id="tipoaudio"
                    labelid="tipoaudio"
                    variant="standard"
                    required
                    fullWidth="true"
                    onChange={handleTipoAudio}
                    value={tipoAudio}
                    InputLabelProps={{
                        shrink: true,
                    }}
                >
                    <MenuItem value={0}>Original</MenuItem>
                    <MenuItem value={1}>Dublado</MenuItem>
                </Select>
                <br />
                <br />
                <Autocomplete
                    options={lstSalas}
                    getOptionLabel={option => (option ? option.descricao : "")}
                    getOptionSelected={option => option.id.toString() === sala}
                    required
                    fullWidth="true"
                    // onChange={(event, newValue) => {
                    //     handleSalaChange(event, newValue);
                    // }}
                    renderInput={(params) => <TextField
                        {...params}
                        id="sala"
                        label="Sala"
                        variant="standard"
                        outputFormat="string"
                    />
                    }
                />
                <br />
                <br />
                <Autocomplete
                    options={lstFilmes}
                    getOptionLabel={option => (option ? option.titulo : "")}
                    getOptionSelected={option => option.id.toString() === filme}
                    required
                    fullWidth="true"
                    onChange={(event, newValue) => {
                        handleFilmeChange(event, newValue);
                    }}
                    renderInput={(params) => <TextField
                        {...params}
                        id="filme"
                        label="Filme"
                        variant="standard"
                        outputFormat="string"
                    />
                    }
                />
                <br />
                <br />
                <Grid justfyContent="center" alignItems="flex-end">
                    <Button type="submit" variant="contained" color="primary" >Salvar</Button>&nbsp;&nbsp;
                    <Button variant="contained" color="default" onClick={handleRedirectSessoes}>Cancelar</Button>
                </Grid>
            </form>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModal}
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

UpdateSessao.prototype = {
    sessao: PropTypes.object.isRequired
}

export default UpdateSessao;
