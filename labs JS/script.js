let p = document.querySelector("p");
p.textContent = "Hello World!"

let button = document.querySelector("button")

button.ondblclick = function() {
    alert(p.textContent);
};