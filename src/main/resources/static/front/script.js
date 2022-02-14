// 成功提示
function showSuccessMsg(msg) {
    $("body").append("<div class='success-notification animated fadeIn'>" + msg + "</div>");
    $(".success-notification").delay(2000).fadeOut();
}

// 错误提示
function showErrorMsg(msg) {
    $("body").append("<div class='error-notification animated fadeIn'>" + msg + "</div>");
    $(".error-notification").delay(2000).fadeOut();
}

// 加载商品列表
function loadGoodsList(pageNum, categoryId, keywords) {
    $.ajax({
        type: 'GET',
        url: '/goodsList',
        async: false,
        data: {
            'page': pageNum,
            'categoryId': categoryId,
            'keywords': keywords
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                let records = data.result.records;
                if (records.length == 0) {
                    // 没有数据了
                    HAS_NEXT = false;
                    let html = '<div class="col-12 col-md-12">' +
                        ' <div class="card weekly-product-card">' +
                        '     <div class="card-body d-flex align-items-center">' +
                        '         没有更多数据了！' +
                        '     </div>' +
                        ' </div>' +
                        ' </div>';
                    $('#goodsListDiv').append(html);
                } else {
                    let html = '';
                    // 有数据，加载
                    $.each(records, function (index, value) {
                        HAS_NEXT = true;
                        html += '<div class="col-12 col-md-12">' +
                            '<div class="card weekly-product-card">' +
                            '    <div class="card-body d-flex align-items-center">' +
                            '        <div class="product-thumbnail-side">' +
                            '            <a class="product-thumbnail d-block"' +
                            '               href="/goods/' + value.id + '">' +
                            '                <img src="' + value.thumbnail + '" alt=""></a>' +
                            '        </div>' +
                            '        <div class="product-description">' +
                            '            <a class="product-title d-block" href="/goods/' + value.id + '">' + value.name +
                            '            </a>' +

                            '            <p>' +
                            '<span style="color: #ffaf00;font-size:1.1em;"> ¥ ' + value.price + '</span><span style="font-size:0.8em;"> &nbsp;销量 ' + value.sellNum + '</span>' +
                            '            </p>';
                        if (value.stockNum <= 0) {
                            html += ' <a class="btn btn-danger btn-sm">' +
                                '库存不足' +
                                ' </a>';
                        } else {
                            html += ' <a class="btn btn-success btn-sm add2cart-notify btn-add-cart-buy" data-id="' + value.id + '">' +
                                '     <i class="mr-1 lni lni-cart"></i>立即购买' +
                                ' </a>';
                        }

                        html += ' </div>' +
                            '         </div>' +
                            '     </div>' +
                            ' </div>';
                    });
                    $('#goodsListDiv').append(html);
                }
            } else {
                showErrorMsg(data.msg);
            }

        }
    });
}

// 加载购物车
function loadCartTotalAmount() {
    $.ajax({
        type: 'GET',
        url: '/cartTotalAmount',
        async: false,
        data: {},
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                $('#cartTotalAmount').html(data.result);
            } else {
                showErrorMsg(data.msg);
            }

        }
    });
}

// 加入购物车
function addCart(goodsId, goodsCount) {
    $.ajax({
        type: 'POST',
        url: '/addCart',
        async: false,
        data: {
            'goodsId': goodsId,
            'goodsCount': goodsCount
        },
        success: function (data) {
            if (data.code == 1) {
                // 添加成功，重新查询购物车金额
                loadCartTotalAmount();
                showSuccessMsg(data.msg);
            } else {
                showErrorMsg(data.msg);
            }

        }
    });
}


// 加入购物车
function addCartAndBuy(goodsId, goodsCount) {
    $.ajax({
        type: 'POST',
        url: '/addCart',
        async: false,
        data: {
            'goodsId': goodsId,
            'goodsCount': goodsCount
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                // 添加成功，重新查询购物车金额
                loadCartTotalAmount();
                showSuccessMsg(data.msg);
                window.location.href = '/cart';
            } else {
                showErrorMsg(data.msg);
            }

        }
    });
}

// 删除购物车
function deleteCart(id) {
    $.ajax({
        type: 'POST',
        url: '/deleteCart',
        async: false,
        data: {
            'id': id,
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                $('#row-' + id).remove();
                loadCartTotalAmount();
                // 添加成功，重新查询购物车金额
                showSuccessMsg(data.msg);
            } else {
                showErrorMsg(data.msg);
            }

        }
    });
}


// 更新下购物车
function updateCart(id, goodsCount) {
    $.ajax({
        type: 'POST',
        url: '/updateCart',
        async: false,
        data: {
            'id': id,
            'goodsCount': goodsCount
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                loadCartTotalAmount();
                showSuccessMsg(data.msg);
            } else {
                showErrorMsg(data.msg);
                $('#cart-input-' + id).val(1);
            }

        }
    });
}

$('#btn-goto-checkout').click(function () {
    $.ajax({
        type: 'GET',
        url: '/checkCart',
        async: false,
        data: {},
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                window.location.href = '/checkout/payment';
            } else {
                showErrorMsg(data.msg);
            }

        }
    });
});


$('.btn-goto-payment').click(function () {
    let type = $(this).attr('data-type');
    $.ajax({
        type: 'POST',
        url: '/createOrder',
        async: false,
        data: {
            'payType': type
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                let orderNo = data.result;
                window.location.href = '/payment/alipay/create?orderNo=' + orderNo;
            } else {
                showErrorMsg(data.msg);
            }

        }
    });
});