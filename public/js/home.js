const form = document.getElementById("infoForm");
const table = document.getElementById("infoTable");
const viewTable = document.getElementById("viewTable");
const head = document.getElementById("headTitle");
const backArrow = document.getElementById("backArrow");
const Submit = document.getElementById("fromSubmit");
const sidebar = document.getElementById("sidebar");
const homeSide = document.getElementById("homeSide");
const addCouresSide = document.getElementById("addCouresSide");

function View(code) {
  // Fetch data using GET method
  fetch(`/view?code=${code}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const course = data[0];
      backArrow.classList.remove("d-none");
      viewTable.classList.remove("d-none");
      homeSide.classList.remove("active");
      table.classList.add("d-none");
      head.textContent = "Course Details";
      document.getElementById("tdCode").textContent = course.code;
      document.getElementById("tdName").textContent = course.name;
      document.getElementById("tdCg").textContent = course.category;
      document.getElementById("tdLsn").textContent = course.lesson;
      document.getElementById("tdDur").textContent = course.duration;
      document.getElementById("thumbLink").href = course.thumbnails;
      document.getElementById(
        "introLink"
      ).href = `/play?intro=${encodeURIComponent(course.courseIntro)}`;
      document.getElementById("playLink").href = course.coursePlayList;
      document.getElementById("tdDes").textContent = course.description;
      document.getElementById("tdCont").textContent =
        course.lessonContent.join(", ");
      // document.getElementById("tdUp").textContent = course.lastUpdate;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function Edit() {
  form.classList.remove("d-none");
  backArrow.classList.remove("d-none");
  homeSide.classList.remove("active");
  table.classList.add("d-none");
  head.textContent = "Update Course";
  Submit.textContent = "Update";
}

function Back() {
  form.classList.add("d-none");
  backArrow.classList.add("d-none");
  if (localStorage.getItem("sidebar") === "false") {
    homeSide.classList.add("active");
  }
  viewTable.classList.add("d-none");
  addCouresSide.classList.remove("active");
  table.classList.remove("d-none");
  head.textContent = "Courses";
}

function Add() {
  form.classList.remove("d-none");
  homeSide.classList.remove("active");
  backArrow.classList.add("d-none");
  table.classList.add("d-none");
  viewTable.classList.add("d-none");
  if (localStorage.getItem("sidebar") === "false") {
    addCouresSide.classList.add("active");
  }
  head.textContent = "Add Course";
  Submit.textContent = "Add";
}

function Home() {
  form.classList.add("d-none");
  if (localStorage.getItem("sidebar") === "false") {
    homeSide.classList.add("active");
  }
  viewTable.classList.add("d-none");
  backArrow.classList.add("d-none");
  table.classList.remove("d-none");
  addCouresSide.classList.remove("active");
  head.textContent = "Courses";
}

if (localStorage.getItem("sidebar") === "true") {
  sidebar.classList.add("sidebar-small");
  if (
    table.classList.contains("d-none") &&
    viewTable.classList.contains("d-none") &&
    Submit.textContent !== "Update"
  ) {
    addCouresSide.classList.add("active");
  } else {
    homeSide.classList.remove("active");
  }
} else {
  sidebar.classList.remove("sidebar-small");
  if (table.classList.contains("d-none")) {
    addCouresSide.classList.remove("active");
  } else {
    if (localStorage.getItem("sidebar") === "false") {
      homeSide.classList.add("active");
    }
  }
}

function SideBar() {
  if (localStorage.getItem("sidebar") === "true") {
    localStorage.setItem("sidebar", "false");
    sidebar.classList.remove("sidebar-small");
    if (
      table.classList.contains("d-none") &&
      viewTable.classList.contains("d-none") &&
      Submit.textContent !== "Update"
    ) {
      if (localStorage.getItem("sidebar") === "false") {
        addCouresSide.classList.add("active");
      }
    } else {
      if (localStorage.getItem("sidebar") === "false") {
        homeSide.classList.add("active");
      }
    }
  } else {
    localStorage.setItem("sidebar", "true");
    sidebar.classList.add("sidebar-small");
    addCouresSide.classList.remove("active");
    homeSide.classList.remove("active");
  }
}
