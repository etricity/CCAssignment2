function paintPage(response) {
  document.getElementById("greeting").innerText = response.display_name;
  document.getElementById("name").innerText = response.display_name;
  document.getElementById("email").innerText = response.email;
  document.getElementById("country").innerText = response.country;
  document.getElementById("product").innerText = response.product;

}
