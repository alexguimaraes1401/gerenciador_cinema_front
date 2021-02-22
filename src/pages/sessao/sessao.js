import { React } from "react";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PageTitle from "../../components/PageTitle/PageTitle";
import AddSessao from "../../components/Sessao/AddSessao";
import UpdateSessao from "../../components/Sessao/UpdateSessao";

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
    }
}))

function Sessao(props) {
    const classes = useStyles();

    return (
        <>
            <div>
                <PageTitle title="Sessão" />
            </div>
            <Paper className={classes.paper}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12}>
                        {props.location.state === null || props.location.state === undefined
                            ? <AddSessao />
                            : <UpdateSessao sessao={props.location.state} />
                        }
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}

export default Sessao;