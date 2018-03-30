import bodyParser from 'body-parser';

//https://themeteorchef.com/tutorials/handling-webhooks
Picker.middleware(bodyParser.json());
Picker.route('/webhooks/stripe', function(params, req, res) {
  
  var body = req.body;
  console.log("******************************")
  console.log("stripe webhook")
  console.log(body);
  
  //https://www.masteringmodernpayments.com/stripe-webhook-event-cheatsheet
  
  switch(body.type){/*
    case "charge.succeeded":
      break;*/
    case "invoice.payment_succeeded":
      //console.log("invoice.payment_succeeded")
      break;/*
    case "customer.subscription.updated":
      stripeUpdateSubscription(request.data.object);
      break;
    case "invoice.created":
      stripeCreateInvoice(request.data.object);
      break;*/
  }
    res.statusCode = 200;
    res.end('Thx Stripe!');
});

Picker.route( '/charge', function( params, request, response ) {
  console.log(params);
  var body = request.body;
  console.log(body);

  response.setHeader( 'Content-Type', 'application/json' );
  response.statusCode = 200;
  response.end( JSON.stringify( {
    msg: "good", 
    res: "ok"
  } ) );
  

  //  response.statusCode = 404;
  //  response.end( JSON.stringify( { error: 404, message: "Document not found." } ) );

});