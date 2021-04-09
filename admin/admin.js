let dropArea = null;
let dropList = null;
window.addEventListener("DOMContentLoaded", () => {
  dropArea = document.querySelector(".upload");
  dropList = document.querySelector(".uploaded");
  //nad targetem upuszczenia
  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.innerText = "JEJJJJ UPUŚĆ MNIE ";
  });
  //nad listą
  dropList.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.innerText = "Halo tu jestem";
    dropList.innerText = "Nie tu trochę wyżej";
  });
  //wyjście z areny
  dropArea.addEventListener("dragleave", () => {
    dropArea.innerText = "DROP ME HERE";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    let containsCover = false;
    dropArea.innerText = "Pliki dodano";
    dropList.innerText = "";

    let formData = new FormData(); // to wyśle
    formData.append("input", e.dataTransfer.files);
    Array.from(e.dataTransfer.files).forEach((element, counter) => {
      switch (element.name.split(".").pop()) {
        case "mp3":
          validator(element.name, "/admin/img/song.svg");
          formData.append(element.name, e.dataTransfer.files[counter]);
          break;
        case "jpg":
        case "jpeg":
        case "png":
          if (!containsCover) {
            validator(element.name, "/admin/img/cover.svg");
            formData.append("cover", e.dataTransfer.files[counter]);
            containsCover = true;
          } else {
            validator(
              "Znaleziono więcej niż 1 obraz, może występować tylko 1 okładka",
              "/admin/img/deny.svg"
            );
          }
          break;
        default:
          validator(
            `Fromat  ${element.name
              .split(".")
              .pop()}, nie jest formatem akceptowalnym `,
            "/admin/img/deny.svg"
          );
          break;
      }
    });
    console.log(formData);
    fetch("/upload", {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      method: "POST",
      body: formData,
    }).then();
  });
});

function validator(name, imagine) {
  let container = document.createElement("div");
  container.classList.add("row");
  let ikonka = document.createElement("img");
  ikonka.src = imagine;
  container.appendChild(ikonka);
  let nazwa = document.createElement("span");
  let nazwaUtworu = document.createTextNode(name);
  nazwa.appendChild(nazwaUtworu);
  container.appendChild(nazwa);
  dropList.appendChild(container);
}
