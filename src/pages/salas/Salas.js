import { React, useState, useEffect} from "react";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import PageTitle from "../../components/PageTitle/PageTitle";

import axios from 'axios';

function Salas() {
  const [lstSalas, setlstSalas] = useState([]);
 
  useEffect(() => {
    axios.get('http://localhost:60700/api/sala/listar-salas')
        .then(res => {
            const salas = res.data;

            if (salas.ok === true){                
              let lstsalas = [];
              salas.data.forEach(element => {
                let sala = [];
                sala.push(element.id, element.descricao, element.quantidadeAssentos);
                lstsalas.push(sala);                
             });
             setlstSalas(lstsalas);
            }             

        }).catch(err => {
        console.log(err);
    });
},[setlstSalas, lstSalas]);

  return (
    <>
      <PageTitle title="Salas de Cinema" />
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12}>
          <MUIDataTable
            title="Lista de Salas"
            data={lstSalas}
            columns={["ID", "Decrição", "Quantidade Assentos"]}
            options={{
              sort: true,
              filter: true,
              selectableRows: "false",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Salas;