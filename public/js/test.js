const $showBtn = document.querySelector(".show-users")
const $usersWrapper = document.querySelector("#users-wrapper")


$showBtn.addEventListener("click", () => {

    $usersWrapper.classList.toggle("active")
});