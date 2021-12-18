var data = [
  ["1", "Jhon Smith", "345263774", "External Consultant"],
  ["2", "Emma Bunton", "7364536363", "Tax Auditor"],
  ["3", "Bunton Jonathon", "09364526378", "External Consultant"],
  ["4", "Peter Hoa", "4536473652", "Tax Auditor"],
  ["5", "Jensen Wildrem", "77463564537", "Principal Lawyer"],
  ["6", "Amalia Jimenez", "345263774", "Legal Advisor"],
];
var modalData = [
  [
    "1234",
    "Procedure Type",
    "Here goes procedure description",
    "04/20/2018",
    "05/05/2018",
    "Cloe Motana",
    "copy of marriage certificate, ID Card",
    "Create",
  ],
];

var minDate = null;
var maxDate = null;
var modalTable = null;
var table = null;

function openModalDetails() {
  modalTable.clear();
  modalTable.rows.add(modalData);
  modalTable.draw();
  $("#detail_modal").modal();
}

$(document).ready(function () {
  //Configura el texto a mostrar en los recuadros de busqueda de la tabla
  $("#report_ordes_table thead th").each(function () {
    var title = $(this).text();
    $(this).html(
      "<h3>" +
        $(this).text() +
        "</h3>" +
        '<input type="text" placeholder="Search" />'
    );
  });

  //Declaración de la tabla de estatus de pedidos
  table = $("#report_ordes_table").DataTable({
    data: data, //Objeto para el pase de la infromación a mostrar
    language: {
      //Se configuran las traducciones del texto que se muestra en cada reporte
      lengthMenu: "Show _MENU_ Elements per page",
      zeroRecords: "Records not found",
      info: "Showing page _PAGE_ of _PAGES_",
      infoEmpty: "You have none records",
      infoFiltered: "(Filtering total records : _MAX_  )",
    },
    columnDefs: [
      {
        targets: -1,
        data: null,
        defaultContent:
          '<a id="#open_modal_details" onClick="openModalDetails()"" class="link">Open Detail</p>',
      },
    ],
  });

  //Declaración de la tabla del detalle del pedido
  modalTable = $("#detail_table_modal").DataTable({
    data: [], //Objeto para el pase de la información a mostrar
    language: {
      //Se configuran las traducciones del texto que se muestra en cada reporte
      lengthMenu: "Show _MENU_ Elements per page",
      zeroRecords: "Records not found",
      info: "Showing page _PAGE_ of _PAGES_",
      infoEmpty: "You have none records",
      infoFiltered: "(Filtering total records : _MAX_  )",
    },
  });

  // Agrega los campos para fltrar en las columnas
  table.columns().every(function () {
    var that = this;

    $("input", this.header()).on("keyup change", function () {
      if (that.search() !== this.value) {
        that.search(this.value).draw();
      }
    });
  });

  //Valida los rangos de fechas dados por el usuario
  $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    //Agregar un buscar la columna de fecha para el filtro
    var date = new Date(data[1]).getTime() || null; // use data for the age column

    if (minDate === null && maxDate === null) {
      return true;
    } else if (minDate !== null && maxDate === null) {
      //Si se pasa sólo la fecha mínima
      if (date >= minDate) {
        return true;
      }
    } else if (minDate === null && maxDate !== null) {
      //Si se pasa sólo la fecha máxima
      if (date <= maxDate) {
        return true;
      }
    } else if (date >= minDate && date <= maxDate) {
      //Si se pasan ambas fechas
      if (date >= minDate && date <= maxDate) {
        return true;
      }
    }

    return false;
  });

  //Función que se encarga del filtrado de los registros
  $("#filter_button").click(function () {
    minDate = new Date($("#begin_date").val()).getTime() || null;
    maxDate = new Date($("#end_date").val()).getTime() || null;

    table.draw();
  });
});
