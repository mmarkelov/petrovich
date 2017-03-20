$('document').ready(function () {

    var firstElementPosition, lastElementPosition;

    var $productsSection = $('#products_section');

    var $loader = $('#loader');

    var elements = [];

    const quantityElements = 10;

    function getInformation(item, index) {
        return `
            <div class="products_page pg_${index}">
               <div class="product product_horizontal">
                  <span class="product_code">Код: ${item.code.slice(5)}</span>
                  <div class="product_status_tooltip_container">
                     <span class="product_status">Наличие</span>
                  </div>
                  <div class="product_photo">
                     <a href="#products_page pg_${index}" class="url--link product__link">
                     <img src="https:${item.primaryImageUrl.slice(0, -4)}_220x220_1.jpg">
                     </a>
                  </div>
                  <div class="product_description">
                     <a href="#products_page pg_${index}" class="product__link">${item.title}</a>
                  </div>
                  <div class="product_tags hidden-sm">
                     <p>Могут понадобиться:</p>
                     ${item.assocProducts.slice(0, -1).split(';').map((prod) => `<a href="#" class="url--link">${prod}</a>`)}
                  </div>
                  <div class="product_units">
                     <div class="unit--wrapper">
                        <div class="unit--select unit--active">
                           <p class="ng-binding">За ${item.unit}</p>
                        </div>
                        ${item.unit !== item.unitAlt ? `
                        <div class="unit--select">
                           <p class="ng-binding">За ${item.unitAlt}</p>
                        </div>
                        ` : ''}
                     </div>
                  </div>
                  <p class="product_price_club_card">
                     <span class="product_price_club_card_text">По карте<br>клуба</span>
                     <span class="goldPrice">${item.priceGold.toFixed(2)}</span>
                     <span class="rouble__i black__i">
                        <svg version="1.0" id="rouble__b" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="30px" height="22px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
                           <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_black"></use>
                        </svg>
                     </span>
                  </p>
                  <p class="product_price_default">
                     <span class="retailPrice">${item.priceRetail.toFixed(2)}</span>
                     <span class="rouble__i black__i">
                        <svg version="1.0" id="rouble__g" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="30px" height="22px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
                           <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_gray"></use>
                        </svg>
                     </span>
                  </p>
                  <div class="product_price_points">
                     <p class="ng-binding">Можно купить за 231,75 балла</p>
                  </div>
                  ${item.unit !== item.unitAlt ? `
                  <div class="list--unit-padd"></div>
                  <div class="list--unit-desc">
                     <div class="unit--info">
                        <div class="unit--desc-i"></div>
                        <div class="unit--desc-t">
                           <p>
                              <span class="ng-binding">Продается упаковками:</span>
                              <span class="unit--infoInn">1 ${item.unit} = ${(1/item.unitRatioAlt).toFixed(2)} ${item.unitAlt} </span>
                           </p>
                        </div>
                     </div>
                  </div>
                  ` : ''}
                  <div class="product__wrapper">
                     <div class="product_count_wrapper">
                        <div class="stepper">
                           <input class="product__count stepper-input" type="text" value="1">
                           <span class="stepper-arrow up"></span>
                           <span class="stepper-arrow down"></span>                                            
                        </div>
                     </div>
                     <span class="btn btn_cart" data-url="/cart/" data-product-id=${item.productId}>
                        <svg class="ic ic_cart">
                           <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart"></use>
                        </svg>
                        <span class="ng-binding">В корзину</span>
                     </span>
                  </div>
               </div>
            </div>
        `
    }

    $.post(
        'http://localhost:3090/getelements',
        {
            firstElementPosition: 0,
            lastElementPosition: 10
        },
        function (data) {
            firstElementPosition = 10;
            lastElementPosition = 10 + quantityElements;

            elements = [...data];
            $productsSection.append(data.map(getInformation));
        }
    ).fail(function () {
        $productsSection.html('Проверьте ваше подключение и перезагрузите страницу!')
    }).done(function () {
        $loader.hide();
    });

    $(document).on("click", '.unit--select', function () {
        $(this).addClass('unit--active').siblings().removeClass('unit--active');
        var id = $(this).closest('.products_page').attr('class').slice(17);
        var unit = $(this).find('p').text().slice(3);
        var goldPrice = $(this).closest('.products_page').find('.goldPrice');
        var retailPrice = $(this).closest('.products_page').find('.retailPrice');

        unit === elements[id].unit ? goldPrice.html(elements[id].priceGold.toFixed(2)) : goldPrice.html(elements[id].priceGoldAlt.toFixed(2));
        unit === elements[id].unit ? retailPrice.html(elements[id].priceRetail.toFixed(2)) : retailPrice.html(elements[id].priceRetailAlt.toFixed(2));
    });

    $(document).on("click", '.down', function () {
        var input =  $(this).closest('.products_page').find('input');
        var count = parseInt(input.val()) - 1;

        count = count < 1 ? 1 : count;
        input.val(count);
        input.change();

        return false;
    });

    $(document).on("click", '.up', function () {
        var input =  $(this).closest('.products_page').find('input');
        input.val(parseInt(input.val()) + 1);

        input.change();

        return false;
    });
    
    $(document).on("click", '.btn_cart', function () {
        var quantity =  $(this).closest('.products_page').find('input').val();
        var price = $(this).closest('.products_page').find('.goldPrice').html();
        var productId = $(this).attr('data-product-id');

        alert(`                Выбранное количество товаров: ${quantity}
                Предварительная стоимость: ${(quantity*price).toFixed(2)}
                ID товара: ${productId}`);
    });

    $(window).scroll(function () {

        if ($(window).scrollTop() == $(document).height() - $(window).height()) {

           $.ajax({
               type: 'POST',
               url: 'http://localhost:3090/getelements',
               beforeSend: function () {
                   $('.product__area').append($loader.html());
               },
               data: {
                   firstElementPosition: firstElementPosition,
                   lastElementPosition: lastElementPosition
               },
               success: function (data) {
                   if (data.length !== 0) {
                       firstElementPosition += quantityElements;
                       lastElementPosition += quantityElements;
                   }

                   elements = [...data];
                   $productsSection.append(data.map(getInformation));

               }
           }).done(function() {
               $('.fa').hide();
           });
        }
    });

});