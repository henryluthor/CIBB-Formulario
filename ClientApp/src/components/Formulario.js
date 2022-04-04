import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import { Form, Radio, Input } from "antd";

export class Formulario extends Component {
    constructor(props) {
        super(props);

        this.state =
        {
            datosFormulario: {
                nombres: '',
                apellidos: '',
                cedula: '',
                pais: '',
                paises: [],
                idPais: '',
                idPaises: [],
                ciudad: '',
                ciudades: [],
                idCiudad: '',
                idCiudades: [],
                institucion: '',
                tipoInstitucion: '',
                showInstBox: false,
                nombreInstitucion: '',
                tipoParticipante: '',
                showParticipRadio: false,
                estudianteChecked: false,
                tipoEstudiante: '',
                showStudentTypeRadio: false,
                email: '',
                celular: '',
                participacion: '',
                showFileBox: false,
                presentacion: '',
                presentacionFile: null,
                modoInformado: '',
                idModoInformado: '',
                otroModoInformado: '',
                esEspol: '',
                otrosChecked: false
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.getDatosEspol = this.getDatosEspol.bind(this);
    }

    getDatosEspol(ced) {
        console.log("getDatosEspol", ced);
        var cedulaS = this.state.cedula;

        //cargar formulario con datos de la API
        fetch("https://wsalumni.espol.edu.ec/api/Informacion/GetIdPersona/" + ced)
            .then(response => response.json())
            .then(responsejson => {
                console.log(responsejson);
                var datosgrado = responsejson["tdatosalumni"];
                var dto = this.state.datosFormulario;
                if (datosgrado != null) {
                    dto["nombres"] = datosgrado.nombres;
                    dto["apellidos"] = datosgrado.apellidos;
                    dto["institucion"] = "universidad";
                    dto["nombreinstitucion"] = "Escuela Superior Politécnica del Litoral";
                    dto["tipoparticipacion"] = "pregrado";
                    dto["email"] = datosgrado.email;
                    dto["celular"] = datosgrado.codarea + datosgrado.telefonocelular;
                    this.setState({ datosFormulario: dto });
                }       
            });
    }

    componentDidMount() {
        this.getPaises()
    }

    getPaises() {
        console.log("get paises");
        fetch("https://ws.espol.edu.ec/rest/api/Pais/getconciudad")
            .then(response => response.json())
            .then(responsejson => {              
                console.log("En mi API el elemento 58 es " + responsejson.[58].strNombre);
                var jsonLength = Object.keys(responsejson).length;
                console.log(jsonLength);
                var datospaises = responsejson;
                console.log("En mi array el elemento 58 es " + datospaises.[58].strNombre);
                var dto = this.state.datosFormulario;
                //hacer for
                var listaPaises = [];
                var listaIdPaises = [];
                for (let i = 0; i < jsonLength; i++) {
                    listaPaises[i] = datospaises.[i].strNombre;
                    listaIdPaises[i] = datospaises.[i].siIdPais;
                }
                //console.log(listaPaises);
                dto["paises"] = listaPaises;
                dto["idPaises"] = listaIdPaises;
                console.log(this.state.datosFormulario.paises);
                console.log(this.state.datosFormulario.idPaises);
                this.setState({ datosFormulario: dto });
            });
    }

    getCiudades(idpais)
    {
        console.log("get ciudades");
        fetch("https://ws.espol.edu.ec/rest/api/Pais/getconciudad")
            .then(response => response.json())
            .then(responsejson => {
                var datospaises = responsejson;
                var jsonLengthCountries = Object.keys(responsejson).length;
                var jsonLengthCities = Object.keys(responsejson.[58].listCanton).length;
                console.log(jsonLengthCities);
                console.log(datospaises.[58].listCanton.[76].siIdCanton);
                console.log(datospaises.[58].listCanton.[76].strNombreCanton);
                var puesto = 0;
                while (datospaises.[puesto].siIdPais != idpais) {
                    puesto++;
                    console.log(datospaises.[puesto].strNombre)
                }
                console.log("Pais que hizo match: " + datospaises.[puesto].strNombre);
                console.log(datospaises.[puesto].listCanton.[76].strNombreCanton);
                //for para obtener las ciudades
                var listaCiudades = [];
                var listaIdCiudades = [];
                for (let i = 0; i <= jsonLengthCities; i++) {
                    listaCiudades[i] = datospaises.[puesto].listCanton.[i].strNombreCanton;
                    listaIdCiudades[i] = datospaises.[puesto].listCanton.[i].siIdCanton;
                }
                console.log(listaCiudades);

            });

    }

    handleChange(e) {
        console.log("propery: ", e.target.name);
        console.log("value: ", e.target.value);
        var dto = this.state.datosFormulario;
        dto[e.target.name] = e.target.value
        this.setState({ datosFormulario: dto });
        if (e.target.name === "cedula" && e.target.value.length === 10) {
            console.log("en if de cedula");
            var cedula = this.state.datosFormulario.cedula;
            this.getDatosEspol(cedula);
        }

    }

    uploadFile(presentacionFile) {
        //creating form data object and append file into that form data
        const url = "https://localhost:44316/api/TblCibbRegistroes";
        let formData = new FormData();
        formData.append("ArchivoPresentacion", presentacionFile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        //return axios.post(url, formData, config);

        //alert('You have successfully upload the file!');
     }

    syncChanges(value, property) {
        console.log("value", value);
        console.log("property", property);
        if (property === "cedula" && value.length === 10) {
            console.log("llama al api");
            this.getDatosEspol(value);
        }
        let state = {};
        state[property] = value;
        this.setState(state);
        this.setState({property: value});
    }

    submitForm() {
        console.log(this.state);
    }

onSubmit(){
    this.uploadFile(this.state.presentacionFile)
        .then((response) => { console.log(response.data); });
        //fetch al controlador post de mi API
        const POST_CIBB = JSON.stringify({
            "apellidos": this.state.apellidos,
            "nombres": this.state.nombres,
            "numeroidentificacion": this.state.cedula,
            "idpais": 1,
            "idcanton": 72,
            "tipoinstitucion": this.state.tipoInstitucion,
            "nombreinstitucion": this.state.nombreInstitucion,
            "tipoparticipante": this.state.tipoParticipante,
            "tipoestudiante": this.state.tipoEstudiante,
            "email": this.state.email,
            "celular": this.state.celular,
            "tipoparticipacion": this.state.participacion,
            "rutapresentacion": this.state.presentacion,
            "modoinformado": this.state.idModoInformado,
            "otromodoinformado": this.state.otroModoInformado,
            "esespol": this.state.esEspol,
            "fecharegistro": new Date(),
            "aniocongreso": "2022"
        });

        fetch("https://localhost:44316/api/TblCibbRegistroes", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },            
            body: POST_CIBB,
        })
        .then(res => res.json);

    }

    crearTransaccion() {
        const POST_TRANSACCION = JSON.stringify({
            "intIdEstadoTransaccion": 21,
            "intIdMensaje": 105,
            "intIdTransaccionRegistro": 50,
            "intIdSistemaRequerimiento": 10,
            "strCorreo": "imosquer@espol.edu.ec",
            "strDetallePago": "PRUEBA CIBB",
            "strDireccion": "CIUDAD CELESTE",
            "strIdentificacion": "0925467227",
            "strRazonSocial": "MARCELO MOSQUERA",
            "strTelefono": "0991819881",
            "strNombresCliente": "MOSQUERA CARVAJAL IVAN MARCELO",
            "decValor": 100.00,
            "strCorreoCliente": "imosquer@espol.edu.ec",
            "strIdentificacionCliente": "0925467227",
            "intIdPromocion": 100003,
            "strTipoPago": "2",
            "strTipo": "C"
        });

        fetch("http://200.10.147.100:8080/api/SgcTransaccion", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: POST_TRANSACCION,
        })
            .then(res => res.json);
    }



    render() {
        return (
            <form
                onSubmit={this.onSubmit}
                method="POST" enctype="multipart/form-data">
                <label htmlFor="cedula" className="form-label">Cédula *</label>
                <input
                    className="form-control"
                    id="cedula"
                    onChange={this.handleChange}
                    type="text"
                    name="cedula"
                    value={this.state.datosFormulario.cedula}
                />
                <div>
                </div>
                <label htmlFor="nombres" className="form-label">Nombres / First Name *</label>
                <input
                    className="form-control"
                    id="nombres"
                    onChange={this.handleChange}
                    type="text"
                    name="nombres"
                    value={this.state.datosFormulario.nombres}
                />
                <div>
                </div>
                <label htmlFor="apellidos" className="form-label">Apellidos / Last Name *</label>
                <input
                    className="form-control"
                    id="apellidos"
                    onChange={this.handleChange}
                    type="text"
                    name="apellidos"
                    value={this.state.datosFormulario.apellidos}
                />
                <div>
                </div>

                <label for="paisesDataList" class="form-label">País / Country *</label>
                <input
                    onChange={this.handleChange}
                    className="form-control"
                    list="listaPaises"
                    id="paisesDataList"
                    name="pais"
                    value={this.state.datosFormulario.pais}
                    placeholder="Escriba para buscar... / Type to search..."/>
                <datalist id="listaPaises">
                    {this.state.datosFormulario.paises.map((pais) => <option value={pais} />)}
                </datalist>
                
                <div>
                </div>


                <label for="ciudadesDataList" class="form-label">Ciudad / City *</label>
                <input
                    onClick={() => this.getCiudades(1)}
                    onChange={this.handleChange}
                    className="form-control"
                    list="listaCiudades"
                    id="ciudadesDataList"
                    name="ciudad"
                    value={this.state.datosFormulario.ciudad}
                    placeholder="Escriba para buscar... / Type to search..." />
                <datalist id="listaCiudades">
                    {this.state.datosFormulario.ciudades.map((ciudad) => <option value={ciudad} />)}
                </datalist>


                <div>
                    <label htmlFor="institucion" className="form-label">¿Desde que institución te registras? / From which institution do you register? *</label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="institucion"
                        id="empresa"
                        onChange={this.handleChange}
                        //value={this.state.datosFormulario.institucion}
                        value="E"
                    />
                    <label class="form-check-label" for="flexRadioDefault1">Empresa / Company</label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="institucion"
                        id="universidad"
                        onChange={this.handleChange}
                        //value={this.state.datosFormulario.institucion}
                        value="U"
                    />
                    <label class="form-check-label" for="flexRadioDefault2">Universidad / University</label>
                </div>

                <div>
                    <label htmlFor="nombreInstitucion" className="form-label">Indique el nombre de la institución / Indicate the name of the institution *</label>
                    <input
                        className="form-control"
                        id="nombreInstitucion"
                        onChange={this.handleChange}
                        type="text"
                        name="nombreInstitucion"
                        value={this.state.datosFormulario.nombreInstitucion}
                    />
                </div>

                <div>
                    <label htmlFor="tipoParticipante" className="form-label">Elija su tipo de participación / Participant Type *</label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="tipoParticipante"
                        id="profesional"
                        onChange={this.handleChange}
                        //value={this.state.datosFormulario.tipoParticipante}
                        value="P"
                    />
                    <label class="form-check-label" for="flexRadioDefault1">Profesional / Professional</label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="tipoParticipante"
                        id="estudiante"
                        onChange={this.handleChange}
                        //value={this.state.datosFormulario.tipoParticipante}
                        value="E"
                    />
                    <label class="form-check-label" for="flexRadioDefault2">Estudiante / Student</label>
                </div>

                <div>
                    <label htmlFor="tipoEstudiante" className="form-label">Elejir uno / Choose one *</label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="tipoEstudiante"
                        id="pregrado"
                        onChange={this.handleChange}
                        //value={this.state.datosFormulario.tipoEstudiante}
                        value="B"
                    />
                    <label class="form-check-label" for="flexRadioDefault1">Pregrado / Undergraduate</label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="tipoEstudiante"
                        id="postgrado"
                        onChange={this.handleChange}
                        //value={this.state.datosFormulario.tipoEstudiante}
                        value="A"
                    />
                    <label class="form-check-label" for="flexRadioDefault2">Postgrado / Postgraduate</label>
                </div>


                <div>
                </div>

                <label htmlFor="email">Correo electrónico / Email *</label>
                <input                    
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="Ingrese correo electrónico / Enter email"
                    onChange={this.handleChange}                    
                    name="email"
                    value={this.state.datosFormulario.email}
                />
                
                <div>     
                </div>

                <label htmlFor="email" className="form-label">Número de celular / Phone number *</label>
                <input
                    className="form-control"
                    id="celular"
                    onChange={this.handleChange}
                    type="text"
                    name="celular"
                    value={this.state.datosFormulario.celular}
                />


                <div onChange=
                    {
                        (ev) => {
                            if (ev.target.value == "oral" || ev.target.value == "audiocartel") {
                                this.setState({ showFileBox: true })
                            }
                            else {
                                this.setState({ showFileBox: false })
                            }
                        }
                    }>
           
                    <label htmlFor="participacion" className="form-label">Elija su participación en el VI CIBB / Choose your participation in the VI CIBB *</label>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="participacion"
                            id="oral"
                            onChange={this.handleChange}
                            //value={this.state.datosFormulario.participacion}
                            value="O"
                        />
                        <label className="form-check-label" for="flexRadioDefault1">Presentación oral / Oral Presentation</label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="participacion"
                            id="audiocartel"
                            onChange={this.handleChange}
                            //value={this.state.datosFormulario.participacion}
                            value="P"
                        />
                        <label className="form-check-label" for="flexRadioDefault1">Presentación de audiocartel / Audio poster Presentation</label> 
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="participacion"
                            id="asistente"
                            onChange={this.handleChange}
                            //value={this.state.datosFormulario.participacion}
                            value="A"
                        />
                        <label className="form-check-label" for="flexRadioDefault1">Asistente / Assistant</label>
                    </div>

                    <div>
                        <p>Descargar la guía para la presentación de resúmenes <a href="http://www.cibb.espol.edu.ec/sites/cibb.espol.edu.ec/files/Gu%C3%ADa%20para%20la%20presentaci%C3%B3n%20de%20res%C3%BAmenes.pdf" target="_blank">aquí</a>.</p>
                        <p>Download the guide for the presentation of abstracts <a href="http://www.cibb.espol.edu.ec/sites/cibb.espol.edu.ec/files/Gu%C3%ADa%20para%20la%20presentaci%C3%B3n%20de%20res%C3%BAmenes.pdf" target="_blank">here</a>.</p>
                    </div>
                        <div>
                        <input onChange={(e) =>this.setState({ presentacionFile: e.target.files[0]}) }
                                type="file"
                                id="cargaPresentacion"
                                name="cargaPresentacion"/>
                        </div>
                </div>

                <div>
                    <label htmlFor="modoInformado" className="form-label">¿Cómo se enteró del VI CIBB? / How did you find out about the VI CIBB? *</label>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="modoInformado"
                            id="redesSociales"
                            onChange={this.handleChange}
                            //value={this.state.datosFormulario.modoInformado}
                            value="R"
                        />
                        <label className="form-check-label" for="flexRadioDefault1">Redes Sociales / Social Media</label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="modoInformado"
                            id="paginaWeb"
                            onChange={this.handleChange}
                            //value={this.state.datosFormulario.modoInformado}
                            value="P"
                        />
                        <label className="form-check-label" for="flexRadioDefault1">Página Web / Web Page</label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="modoInformado"
                            id="email"
                            onChange={this.handleChange}
                            value="C"
                        />
                        <label className="form-check-label" for="flexRadioDefault1">Correo Electrónico / Email</label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="modoInformado"
                            id="otros"
                            onChange={this.handleChange}
                            value="O"
                        />
                        <label className="form-check-label" for="flexRadioDefault1">Otros / Others</label>
                    </div>

                    <label htmlFor="otroModoInformado" className="form-label">Indique cuál / Please indicate which *</label>
                    <input
                        className="form-control"
                        id="otroModoInformado"
                        onChange={this.handleChange}
                        type="text"
                        name="otroModoInformado"
                        value={this.state.datosFormulario.otroModoInformado}/>
                </div>
                



                <div>
                    <input
                        onClick={
                            () => this.submitForm(),
                            () => this.onSubmit(),
                            () => this.crearTransaccion()}

                        type="submit"
                        value="Submit" />
                </div>
            </form>
        )
    }
}