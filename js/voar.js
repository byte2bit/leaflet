import { centroid } from "./centroids.js";
import { map, feat } from "../main.js";

var linhaDet = "";
var filtr = [];

export function voar() {
    
    $(document).on("click", ".voa", function (eid) {
        // event.preventDefault();
        var id = this.id;
        id = $(this).text();
        if (id === "" || null) {
            id = eid;
        }
        var geoLat = centroid(id)[1];
        var geoLong = centroid(id)[0];

        map.flyTo([geoLat, geoLong], 16);

        filtr = feat.filter((obj) => {
            return obj.properties.Id_Empreen == id;
        });

        linhaDet = "";
        linhaDet += `
        <tr><td>EMPREENDIMENTO: </td><td>${filtr[0].properties.Desc_Empre}</td></tr>
        <tr><td>ID: </td><td>${filtr[0].properties.Id_Empreen}</td></tr>
        <tr><td>DESCRIÇÃO: </td><td>${filtr[0].properties.Desc_Statu}</td></tr>
        <tr><td>BASE PROJETO APROVAÇÃO: </td><td>${filtr[0].properties.Desc_Statu_1}</td></tr>
        <tr><td>AUTUAÇÃO: </td><td>${filtr[0].properties.Desc_Statu_2}</td></tr>
        <tr><td>PE/PA: </td><td>${filtr[0].properties.Desc_Statu_3}</td></tr>
        <tr><td>APROVAÇÃO ESTADUAL: </td><td>${filtr[0].properties.Desc_Statu_4}</td></tr>
        <tr><td>APROVAÇÃO PM: </td><td>${filtr[0].properties.Desc_Statu_5}</td></tr>
        <tr><td>APROVAÇÃO: </td><td>${filtr[0].properties.Desc_Statu_6}</td></tr>
        <tr><td>AVERBAÇÃO: </td><td>${filtr[0].properties.Desc_Statu_7}</td></tr>
        `;
        $("#tdet").html(linhaDet);
    });
}