$(document).ready(function() {
  var optionNum = 2;
  $("#add").click(function(){
    if(optionNum < 10) {
      console.log(optionNum)
      var newNum = optionNum + 1
      $("input[name='Option" + optionNum + "']").after('<label for="Option"'+newNum+'" class="option">Option #'+newNum+'</label><input type="text" class="form-control option" name="Option'+newNum+'" placeholder="This is not bad either.." />')
      optionNum++;
    }
  })

  

})
