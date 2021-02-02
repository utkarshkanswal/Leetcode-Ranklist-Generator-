let arr = [];
let getTxt = function () {
    $.ajax({
        url: 'Data.JSON',
        success: function (data) {
            let myvar = data;
            console.log(myvar);
            for (let i = 0; i < myvar.length; i++) {
                arr.push(myvar[i]);
            }
            arr.sort(function (a, b) {
                return b.total_problems_solved - a.total_problems_solved;
            });
            console.log(arr.length);
            let total = ``;
            let container = document.querySelector('.container');
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].status != 'Failed') {
                    let html = `<div class="newUser">
             <div id="boxr"><a href="">${i+1}</a></div>
             <div id="boxu"><a href="">${arr[i].username}</a></div>
             <div id="boxu"><a href="">${arr[i].year}</a></div>
             <div id="boxu"><a href="">${arr[i].ranking} </a></div>
             <div id="boxu"><a href="">${arr[i].contribution_points}</a></div>
             <div id="boxu"><a href="">${arr[i].acceptance_rate}</a></div>
             <div id="boxn"><a href="">${arr[i].total_problems_solved}</a> </div>
             </div>`;
                    container.innerHTML += html;
                }
            }

        }
    });
}
getTxt();