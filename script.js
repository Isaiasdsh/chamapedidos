let cart = [];
const deliveryFee = 5.00; // Taxa de entrega
const pixKey = "48243861000127"; // Chave Pix

// Adiciona itens ao carrinho
function addToCart(productName, sizeClass, breadClass, ingredientClass) {
    const size = document.querySelector(`input[name=${sizeClass}]:checked`).value;
    const bread = document.querySelector(`input[name=${breadClass}]:checked`).value;

    let removedIngredients = [];
    document.querySelectorAll(`.${ingredientClass}:checked`).forEach((checkbox) => {
        removedIngredients.push(checkbox.value);
    });

    let price = size === 'single' ? 25 : 33; // Defina o preço com base no tamanho
    cart.push({
        productName,
        size: size === 'single' ? 'Simples' : 'Duplo',
        bread,
        price,
        removedIngredients: removedIngredients.join(', ')
    });

    displayCart();
}

// Exibe o carrinho
function displayCart() {
    const cartElement = document.getElementById("cart-content");
    const deliveryFeeElement = document.getElementById("delivery-fee");
    const totalPriceElement = document.getElementById("total-price");

    cartElement.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        cartElement.innerHTML += `<p>${item.productName} (${item.size}) - Pão: ${item.bread} - R$${item.price.toFixed(2)} <br> Removido: ${item.removedIngredients} <button onclick="removeFromCart(${index})">Remover</button></p>`;
        total += item.price;
    });

    deliveryFeeElement.innerHTML = `<h3>Taxa de entrega: R$${deliveryFee.toFixed(2)}</h3>`;
    total += deliveryFee;
    totalPriceElement.innerHTML = `<h3>Total com entrega: R$${total.toFixed(2)}</h3>`;
}

// Remove itens do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
}

// Validação de campos obrigatórios
function validateFields() {
    const customerName = document.getElementById("customer-name").value;
    const address = document.getElementById("address").value;
    const reference = document.getElementById("reference").value;
    
    if (!customerName || !address || !reference) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return false;
    }
    return true;
}

// Finaliza o pedido
function finalizeOrder() {
    if (!validateFields()) return;

    const customerName = document.getElementById("customer-name").value;
    const address = document.getElementById("address").value;
    const reference = document.getElementById("reference").value;

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    let orderSummary = `Pedido de ${customerName}\nEndereço: ${address}\nReferência: ${reference}\n`;

    cart.forEach(item => {
        orderSummary += `Hambúrguer: ${item.productName} (${item.size}), Pão: ${item.bread}, Removido: ${item.removedIngredients}, Preço: R$${item.price.toFixed(2)}\n`;
    });

    orderSummary += `Total com entrega: R$${(total + deliveryFee).toFixed(2)}\n`;

    if (paymentMethod === "pix") {
        orderSummary += `Chave Pix: ${pixKey}\nEnvie o comprovante junto com o pedido!`;
    }

    sendOrderToWhatsApp(orderSummary);
}

// Envia a comanda para o WhatsApp
function sendOrderToWhatsApp(orderSummary) {
    const phoneNumber = "48991758488";
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderSummary)}`;
    window.open(whatsappLink, '_blank');
}
