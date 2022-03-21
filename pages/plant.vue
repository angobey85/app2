<template>
    <div>

        <!-- FORMULARIO AGREGAR PLANTAS -->
        <div class="row">
            <card>
                <div slot="header">
                    <h3 class="card-title">Crear una nueva Planta</h3>
                </div>
                <div class="row">
                    <div class="col-6">
                            <base-input v-model="newPlant.plant_name" label="Nombre" type="text" placeholder=""></base-input>
                    </div>
                    <div class="col-6">
                            <base-input v-model="newPlant.plant_process" label="Proceso" type="text" placeholder=""></base-input>
                    </div>       
                </div>
                <div class="row">
                    <div class="col-6">
                            <base-input v-model="newPlant.plant_subprocess" label="Subproceso" type="text" placeholder=""></base-input>
                    </div>
                    <div class="col-6">
                            <base-input v-model="newPlant.plant_city" label="Ciudad" type="text" placeholder=""></base-input>
                    </div>       
                </div>
                <div class="row">
                    <div class="col-6">
                        <slot name="label">
                            <label>Equipo</label><br>
                        </slot>
                        <el-select v-model="selectedIndexTemplate" placeholder="Seleccione una Plantilla" class="select-primary" style="width:100%">
                            <el-option v-for = "template, index in templates" :key="index" class="text-dark" :label="template.template_name" :value="index"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="row pull-right">
                    <div class="col-12">
                        <base-button @click="saveEquipment()" type="success" class="mb-3">Registrar</base-button> 
                    </div>
                </div>
            </card>
        </div>
        <!-- FORMULARIO MOSTRAR EQUIPOS -->
        <div class="row">
            <card>
                <div slot="header">
                    <h3 class="card-title">Lista de Plantas</h3>
                </div>
                <el-table :data="$store.state.equipments">
                    <el-table-column prop="plant_id" label="ID"></el-table-column>
                    <el-table-column prop="plant_date" label="Fecha"></el-table-column>
                    <el-table-column prop="plant_name" label="Nombre"></el-table-column>
                    <el-table-column prop="plant_process" label="Proceso"></el-table-column>
                    <el-table-column prop="plant_subprocess" label="SubProceso"></el-table-column>
                    <el-table-column prop="plant_city" label="Ciudad"></el-table-column>
                    <el-table-column prop="plant_equipment" label="Equipo"></el-table-column>
                    <el-table-column label="Acciones">
                        <div slot-scope="{row, $index}">    

                            <el-tooltip content="Database Saver">
                                <base-switch @click ="updateSaveRuleStatus(row.equipment_saveRule)" :value = "row.equipment_saveRule.saverule_status" on-text="On" off-text="Off"></base-switch>
                            </el-tooltip>    

                            <el-tooltip content="Borrar">
                                <base-button type="danger" size="sm" class="" @click="deleteEquipment(row)">
                                    <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                        </div>
                    </el-table-column>
                </el-table>
            </card>
        </div>
        

        <pre>
            {{$store.state.selectedEquipment}}
        </pre>

        <pre>
            {{$store.state.equipments}}
        </pre>

    </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
import BaseButton from '../components/BaseButton.vue';

export default{
    middleware: 'authentication',
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select,
    },
    data() {
        return {
            templates:[],
            selectedIndexTemplate: null,
            newPlant:{
                plant_id: "",
                plant_name: "",
                plant_process: "",
                plant_subprocess: "",
                plant_city: "",
                plant_equipment_name: "",
                plant_equipment_id:""
            }
        };
    },
    mounted(){

        this.$store.dispatch("getEquipments");
        this.getTemplates();
        
    },
    methods:{

        updateSaveRuleStatus(rule){
            
            var ruleCopy = JSON.parse(JSON.stringify(rule));
    
            ruleCopy.saverule_status = !ruleCopy.saverule_status;
            const toSend = {
                rule: ruleCopy
            };
            const axiosHeaders = {
                headers:{
                    token: this.$store.state.auth.token
                }
            };

            this.$axios.put("/saver-rule", toSend, axiosHeaders)
            .then(res=> {

                if (res.data.status == "success") {
                    this.$store.dispatch("getEquipments");

                    this.$notify({
                        type: "success",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Estado del Equipo Actualizado"
                    });
                    
                }

                return;
            })
            .catch(e=>{
                console.log(e);
                this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Estado del Equipo no se Actualizo"
                });

                return;
            })

        },

        saveEquipment(){
            
            if (this.newPlant.plant_name == "") {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que llenar el campo Nombre"
                });
                return;    
            }

            if (this.newPlant.plant_process == "") {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que llenar el campo Marca"
                });
                return;    
            }

            if (this.newPlant.plant_subprocess == "") {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que llenar el campo Modelo"
                });
                return;    
            }

            if (this.newPlant.plant_city == "") {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que llenar el campo Tag"
                });
                return;    
            }

            if (this.selectedIndexTemplate == null) {
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tiene que elegir una Plantilla"
                });
                return;    
            }

           const axiosHeaders = {
                headers:{
                    token: this.$store.state.auth.token
                }           
            };

            //LLENAMOS EL NOMBRE Y ID DE TEMPLATE SELECCIONADO

            this.newPlant.plant_equipment_id = this.equipment[this.selectedIndexEquipment]._id;
            this.newPlant.plant_equipment_name = this.equipment[this.selectedIndexEquipment].equipment_name;

            const toSend = {
                newPlant: this.newPlant
            }

            console.log(toSend);

            this.$axios.post("/equipment", toSend, axiosHeaders).then(res =>{

                if (res.data.status == "success") {
                    this.$store.dispatch("getEquipments");
                    this.newPlant.plant_id = "";
                    this.newPlant.plant_name = "";
                    this.newPlant.plant_process = "";
                    this.newPlant.plant_subprocess = "";
                    this.newPlant.plant_city = "";
                    this.selectedIndexEquipment = null;

                    this.$notify({
                        type: "success", 
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Equipo Creado"
                    });
                    
                }

            })
            .catch(e => {
            
                if (e.response.data.status == "error" && e.response.data.error.errors.equipment_id.kind == "unique") {
                    
                    this.$notify({
                        type: "warning", 
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Este Equipo ya esta Registrado"
                    });
                    return;
                    

                }
           



            })

        },

        async getTemplates(){
            const axiosHeaders = {
                headers:{
                    token: this.$store.state.auth.token
                        
                }
                    
            };

            try {
                const res = await this.$axios.get("/template", axiosHeaders);
                console.log(res.data.data);
                if (res.data.status == "success") {

                    this.templates = res.data.data;
                }
            } catch (error) {
                console.log("error");
            }


        },
        

        deleteEquipment(equipment) {
        const axiosHeader = {
            headers: {
            token: this.$store.state.auth.token
            },
            params: {
            equipment_id: equipment.equipment_id
            }
        };
        this.$axios
            .delete("/equipment", axiosHeader)
            .then(res => {
            if (res.data.status == "success") {
                this.$notify({
                type: "success",
                icon: "tim-icons icon-check-2",
                message: equipment.equipment_name + " Eliminado!"
                });
                this.$store.dispatch("getEquipments");
            }
            
            })
            .catch(e => {
            console.log(e);
            this.$notify({
                type: "danger",
                icon: "tim-icons icon-alert-circle-exc",
                message: " Error deleting " + equipment.equipment_name
            });
            });
        },

    }
};
</script>