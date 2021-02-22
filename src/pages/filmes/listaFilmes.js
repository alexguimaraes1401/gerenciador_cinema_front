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

function Filmes(props) {
  const classes = useStyles();

  const [lstFilmes, setlstFilmes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState('');

  const history = useHistory();

  function handleListFilmes() {
    axios.get('http://localhost:60700/api/filme/listar-filmes')
      .then(res => {
        const filmes = res.data;

        if (filmes.ok === true) {
          let lstfilmes = [];
          filmes.data.forEach(element => {
            let filme = [];
            filme.push(element.id, element.titulo, element.descricao, element.duracao, element.imagem);
            lstfilmes.push(filme);
          });
          setlstFilmes(lstfilmes);
        }

      }).catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    handleListFilmes();
  }, []);

  function handlerDisplayChange(e) {
    var file = new Blob([e], {
      type: 'text/plain'
    });

    var reader = new FileReader();

    reader.addEventListener("load", function () {
      setImageFile(reader.result);

    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  function handleEditFilme(filme) {
    history.push({ pathname: '/app/filme', state: filme });
  }

  function handleOpenModal() {
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    handleListFilmes();
  }

  function handleDeleteFilme(filme) {

    var config = {
      method: 'delete',
      url: 'http://localhost:60700/api/filme/deletar-filme',
      headers: {
        'Content-Type': 'application/json'
      },
      data: filme
    };

    axios(config)

      .then(res => {
        const filme = res.data;

        if (filme.ok === true) {

          setModalTitle('Filmes');
          setModalMsg('Filme excluido com suceso!');

          handleOpenModal();
        }

        if (filme.fail === true) {
          setModalTitle('Filme');
          setModalMsg(filme.msg);

          handleOpenModal();
        }

      }).catch(err => {
        console.log(err);
      });
  }

  return (
    <>
      <div>
        <PageTitle title="Filmes" />
        <Link href={'#/app/filme'}><IconButton ><AddBox /></IconButton></Link>Novo Filme
      </div>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12}>
          <MUIDataTable
            title="Lista de Filmes"
            data={lstFilmes}
            columns={["ID",
              "Título",
              "Descrição",
              "Duração",
              {
                name: "Imagem",
                options: {
                  customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (
                      <img id="imagem" src={lstFilmes[rowIndex][4]} onChange={handlerDisplayChange(lstFilmes[rowIndex][4])} height={imageFile ? "200" : "0"} alt="" className={classes.imagem} />
                    );
                  }
                }
              },
              {
                name: "Ação",
                options: {
                  customBodyRenderLite: (dataIndex, rowIndex) => {

                    let filme = {
                      "Id": "" + lstFilmes[rowIndex][0] + "",
                      "Titulo": lstFilmes[rowIndex][1],
                      "Descricao": lstFilmes[rowIndex][2],
                      "Duracao": lstFilmes[rowIndex][3],
                      "Imagem": lstFilmes[rowIndex][4]
                    }

                    return (
                      <>
                        <IconButton onClick={() => handleEditFilme(filme)} ><Edit /></IconButton>
                          &nbsp;
                        <IconButton onClick={() => handleDeleteFilme(filme)} ><DeleteForever /></IconButton>
                      </>
                    );
                  }
                }
              }
            ]}
            options={{
              sort: true,
              filter: true,
              selectableRows: "false",
              textLabels: {
                body: {
                  noMatch: "Não há Filmes cadastrados",
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
            }
            }
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

export default Filmes;