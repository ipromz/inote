window.notes = {
	daily: "",
	weekly: "",
	monthly:"",
	yearly: ""
}

$(document).ready(function() {
	
	let default_active = "daily";
		
	set_tab(default_active);	

	$("#login_form").submit(function(e) {
		e.preventDefault();
	
		let email = $("#email").val();
		let password = $("#password").val();


		auth.signInWithEmailAndPassword(email, password).catch((error) => {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  alert("Error "+errorMessage);
		}).then(cred => {
			//alert("ok")
			//console.log(cred)
			$(".home").show();
			$(".login").hide();
			$(".register").hide();
		})

		
		return false;
	})

	$("#logout_btn").click(function() {
		window.notes = {
			daily: "",
			weekly: "",
			monthly:"",
			yearly: ""
		}
		auth.signOut();
	})


	//register user
	$("#register_form").submit(function(e) {
		//e.preventDefault();
		
		let email = $("#r_email").val();
		let password = $("#r_password").val();
		
		//signup the user
		auth.createUserWithEmailAndPassword(email, password).catch((error) => {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  alert("Error "+errorMessage);
		}).then(cred => {
			//alert("ok")
			//console.log(cred)
			$(".home").show();
			$(".login").hide();
			$(".register").hide();
		})

		return false;
	})

	$("#showRegForm").click(() => {
		
		$(".home").hide();
		$(".login").hide();
		$(".register").show();

	})
	$("#showLoginForm").click(() => {
		
		$(".home").hide();
		$(".login").show();
		$(".register").hide();

	})

	$("textarea").change(function(){

		let key = $(this).attr("data-key");
		let val = $(this).val();
		
		var userid = user.uid;
	
		window.notes[key] =  val;

		db.collection("notes").doc(userid).set(window.notes)

	})
	

	$(".nav a").click(function() {
		$(".nav-pills>li>a").removeClass("activ")
		$(this).addClass("activ");
		$("textarea").hide();
		let key = $(this).attr("data-key");
		$("#"+key+"text").show();
		
	})


});


auth.onAuthStateChanged(function(user) {
  if (user) {
		window.user = firebase.auth().currentUser;
		$(".home").show();
		$(".login").hide();
		$(".register").hide();
		
		db.collection("notes").doc(user.uid)
	    .onSnapshot(function(doc) {
			var temp = doc.data();
			if(temp) {
	        	window.notes = doc.data() ;
			}
	    	$("#dailytext").val(window.notes.daily)
	    	$("#weeklytext").val(window.notes.weekly)
	    	$("#monthlytext").val(window.notes.monthly)
	    	$("#yearlytext").val(window.notes.yearly)

	    	
	    });

	
  } else {
		$(".home").hide();
		$(".login").show();
		$(".register").hide();

  }
});

function set_tab(tab) {
	$(".nav-pills>li>a").removeClass("activ")
	let a = $(".nav-pills>li>a[data-key="+tab+"] ")
	a.addClass("activ");
	$("textarea").hide();
	$("#"+tab+"text").show();
}
