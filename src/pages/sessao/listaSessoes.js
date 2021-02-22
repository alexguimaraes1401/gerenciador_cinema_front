import { React, useState, useEffect } from "react";
import { Grid, IconButton, Link, Modal, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MUIDataTable from "mui-datatables";
import { useHistory } from 'react-router-dom';
import { AddBox, DeleteForever, Edit } from "@material-ui/icons";
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PageTitle from "../../components/PageTitle/PageTitle";
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
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

function Sessoes(props) {
  const classes = useStyles();

  const [lstSessoes, setlstSessoes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState('');

  const history = useHistory();

  function handleListSessoes() {
    axios.get('http://localhost:60700/api/sessao/listar-sessoes')
      .then(res => {
        const sessoes = res.data;

        if (sessoes.ok === true) {
          let lstsessoes = [];
          sessoes.data.forEach(element => {
            let sessao = [];
            sessao.push(element.id, 
                        element.data, 
                        element.horario, 
                        element.valorIngresso, 
                        element.tipoAnimacao,   
                        element.tipoAudio, 
                        element.filme, 
                        element.sala);
            lstsessoes.push(sessao);
          });
          setlstSessoes(lstsessoes);
        }

      }).catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    handleListSessoes();
  }, []);


  function handleEditSessao(sessao) {
    history.push({ pathname: '/app/sessao', state: sessao });
  }

  function handleOpenModal() {
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    handleListSessoes();
  }

  function handleDeleteSessao(sessao) {

    var config = {
      method: 'delete',
      url: 'http://localhost:60700/api/sessao/deletar-sessao',
      headers: {
        'Content-Type': 'application/json'
      },
      data: sessao
    };

    axios(config)

      .then(res => {
        const sessao = res.data;

        if (sessao.ok === true) {

          setModalTitle('Sessoes');
          setModalMsg('Sessao excluida com suceso!');

          handleOpenModal();
        }



      }).catch(err => {
        console.log(err);
      });
  }

  return (
    <>
      <div>
        <PageTitle title="Sessões" />
        <Link href={'#/app/sessao'}><IconButton ><AddBox /></IconButton></Link>Nova Sessão
      </div>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12}>
          <MUIDataTable
            title="Lista de Sessões"
            data={lstSessoes}
            columns={["ID",
              "Data",
              "Horário",
              "Valor Ingresso",
              "Tipo Animação", 
              "Tipo Audio",
              "Filme", 
              "Sala",
              {
                name: "Ação",
                options: {
                  customBodyRenderLite: (dataIndex, rowIndex) => {

                    let sessao = {
                      "Id": "" + lstSessoes[rowIndex][0] + "",
                      "Data": lstSessoes[rowIndex][1],
                      "Horario": lstSessoes[rowIndex][2],
                      "ValorIngresso": lstSessoes[rowIndex][3],
                      "TipoAnimacao": lstSessoes[rowIndex][4],
                      "TipoAudio": lstSessoes[rowIndex][5],
                      "Filme": lstSessoes[rowIndex][6],
                      "Sala": lstSessoes[rowIndex][7]

                    }

                    return (
                      <>
                        <IconButton onClick={() => handleEditSessao(sessao)} ><Edit /></IconButton>
                        &nbsp;
                        <IconButton onClick={() => handleDeleteSessao(sessao)} ><DeleteForever /></IconButton>
                      </> 
                    );
                  }

                }
              },
            ]}
            options={{
              sort: true,
              filter: true,
              selectableRows: "false",
              textLabels: {
                body: {
                  noMatch: "Não há Sessões cadastradas",
                  toolTip: "Ordenar",
                  columnHeaderTooltip: column => `Ordenar por ${column.label}`
                },
                pagination: {
                  next: "Próxima página",
                  previous: "Página anerior",
                  rowsPerPage: "Linhas por página:",
                  displayRows: "de",
                },
                toolbar: {
                  search: "Pesquisar",
                  downloadCsv: "Download CSV",
                  print: "Imprimir",
                  viewColumns: "Exibir colunas",
                  filterTable: "Filtrar",
                },
                filter: {
                  all: "todos",
                  title: "Filtros",
                  reset: "Redefinir",
                },
                viewColumns: {
                  title: "Exibir colunas",
                  titleAria: "Exibir/Esconder Colunas",
                },
                selectedRows: {
                  text: "linha(s) selecionadas",
                  delete: "Excluir",
                  deleteAria: "Excluir linhas selecionadas",
                },
              }
            }}
          />
        </Grid>
      </Grid>
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
}

export default Sessoes;