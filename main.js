// Localstorage

// const person = {
//   name: "Yusuf",
//   surname: "Yaman",
//   age: 22,
// };

// localStorage.setItem("person", JSON.stringify(person));

// console.log(JSON.parse(localStorage.getItem("person")));

// localStorage.clear();

// ! * Projenin Algoritması *//

// 1- Popup açılır

// 2- İnput ve textarea ya girilen değerler formun gönderilmesi sonucunda erişilecek. formun gönderilmnesini izle

// ! Ay  Dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// HTML den ilgili elemanların çekilmesi

const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup-box .popup");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const form = document.querySelector("form");
const settings = document.querySelector(".settings");
const wrapper = document.querySelector(".wrapper");
const button = document.querySelector(".popup button");

// Not güncellemesi için değişkenlerin oluşturulması
let isUpdate = false;
let updateId;

// Localstorage dan notları çekme
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Ekle Iconuna tıklanınca popup açılsın
addBox.addEventListener("click", () => {
  // Pop-up ı görünür kıldık
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  //Sayfa kaydırılmasını engelle
  document.querySelector("body").style.overflow = "hidden";
});

// Kapat iconuna tıklanınca popup kapansın

closeIcon.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

// ! Form gönderildiğinde çalışacak fonksiyon

form.addEventListener("submit", (e) => {
  // Sayfa yenilemeyi iptal ettik
  e.preventDefault();
  // input ve textarea içerisindeki değerlere eişrtik
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];
  //trim medtoduyla boşluğu kaldırdık,
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  // inputların boş olma durumunu kontrol ettik eğer title ve desc. varsa devam et
  if (title && description) {
    // tarih verisine eriş
    const date = new Date();
    // tarih verisi içerisinden ay ı al
    let month = months[date.getMonth()];
    // gün bilgisine eriş
    let day = date.getDate();
    // yıl ekle
    let year = date.getFullYear();

    // Not objesini oluştur
    let noteInfo = { title, description, date: `${month} ${day},${year}` };
    // eğer düzenleme modundaysak notu güncelle değilse yeni not ekle
    if (isUpdate) {
      notes[updateId] = noteInfo;
      isUpdate = false;
    } else {
      notes.push(noteInfo);
    }

    // oluşan objeyi lokale ekle
    localStorage.setItem("notes", JSON.stringify(notes));

    // Popup ı eski haline çevirdik
    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    popupTitle.textContent = "Not Ekle";
    button.textContent = "Not Ekle";
    //Sayfa kaydırılmasını engelle
    document.querySelector("body").style.overflow = "auto";
  }
  // inputların içeriğini temizledik Formu temizle
  titleInput.value = "";
  descriptionInput.value = "";
  showNotes();
});

// Note silme özelliğini sağlayan fonksiyon
function deleteNote(noteId) {
  if (confirm("Silmek istediğinizden emin misiniz ?")) {
    // Belirlenen notu note dizisinden kaldır
    notes.splice(noteId, 1);
    // LocalStorage i güncelle
    localStorage.setItem("notes", JSON.stringify(notes));
    // Notları render et
    showNotes();
  }
}

// Note güncellemesi yapan fonksiyon

function updateNote(noteId, title, description) {
  isUpdate = true;
  updateId = noteId;
  // Pop-up ı görünür kıldık
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  popupTitle.textContent = "Notu Güncelle";
  button.textContent = "Notu Güncelle";
  form.elements[0].value = title;
  form.elements[1].value = description;
}

// Menü içeriğini gösteren fonksiyon
function showMenu(elem) {
  // parentElement bir elemanın kapsam elemanına erişmek için kullanılır.burada tıklanan iconun kapsayıcısına bir class eklememiz gerektiinden parentelement ile bu elemanın kapsayıcısına eriş
  // kapsam elemanına show clası ekledik
  elem.parentElement.classList.add("show");

  // MENU harici bir yere tıklanırsa show clasını kaldır
  document.addEventListener("click", (e) => {
    // Tıklanılan elemana i etiketi değilse yada kapsam elemana eşit değilse show clasını kaldır.Buradaki 'I' kullanımının sebebi tagNmae property sinin büyük harf olarak kabul edilmesidir.
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// ! Ekrana notları renderlayan fonksiyon

function showNotes() {
  // Eğer notlar yoksa fonksiyonu durdur
  if (!notes) return;

  // Önceden eklenen notları kaldır
  document.querySelectorAll(".note").forEach((li) => li.remove());

  // Not dizisindeki her eleman için ekrana bir not kartı bas
  notes.forEach((note, id) => {
    let liTag = `   <li class="note">
        <div class="details">
          <p>${note.title} </p>
          <span>${note.description} </span>
        </div>

        <div class="bottom-content">
          <span>${note.date} </span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded" ></i>
                <ul class="menu">
            <li onclick='updateNote(${id}, "${note.title}", "${note.description}")'><i class="bx bx-edit"></i> Düzenle</li>
            <li onclick='deleteNote(${id})'><i class="bx bx-trash"></i> Sil</li>
          </ul>
          </div>
        </div>
      </li>`;
    // insertAdjacentHTML metodu belirli bir öğeyi Html kısmına sıratlı şekilde eklemek için kullanılır.Bu metod hangi yapının ardında bir  eleman eklenecekse bunu yazmamızı sonrasında ise eklenecek elemanın içeriğini belirltmemizi ister.
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

// Silme ve düzenleme işlemi yapabilmesi için bazı düzenlemeler
// ! Wrappper Html'den erişilen kapsam elemandır
wrapper.addEventListener("click", (e) => {
  // Eğer menu üç nokta iconuna tıklanırsa showmenu fonk.çalıştır

  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
  // Eğer sil iconuna tıklanırsa deleteNote fonk.çalıştır
  else if (e.target.classList.contains("bx-trash")) {
    // dataset bir elemana özellik atamaya yarar.burda id atadık
    const noteId = parseInt(e.target.closest(".note").dataset.id, 10);
    deleteNote(noteId);
  } else if (e.target.classList.contains("bx-edit")) {
    // Düzenleem işlemi yapılacak kapsam elemana eriş
    const noteElement = e.target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id, 10);
    // title ve description değerlerine eriş
    const title = noteElement.querySelector(".details p").innerText;
    const description = noteElement.querySelector(".details span").innerText;

    updateNote(noteId, title, description);
  }
});
document.addEventListener("DOMContentLoaded", () => showNotes());
//! Closest ve parentElement elemanların kapsayıcısına erişmek için kullanılır.Closest direkt olraka erişilmek istenen elemanın özelliğini belirtmemizi ister.parentElemeet de ise tek tek kapsam elemana erişmemiz gerekir.
