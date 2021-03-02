let arr = [];
let getTxt = function (basis, order) {
    $.ajax({
        url: 'Data.JSON',
        success: function (data) {
            let myvar = data;
            console.log(myvar);
            for (let i = 0; i < myvar.length; i++) {
                arr.push(myvar[i]);
            }
            if (basis == 1 && order == 1) {
                arr.sort(function (a, b) {
                    return (b.total_problems_solved - a.total_problems_solved);
                });
            } else if (basis == 1 && order == -1) {
                arr.sort(function (a, b) {
                    return (a.total_problems_solved - b.total_problems_solved);
                });
            }
            console.log(arr.length);
            let total = ``;
            let container = document.querySelector('.container');
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].status != 'Failed') {
                    let html = `<div class="newUser">
             <div id="boxr"><a href="https://leetcode.com/${arr[i].username}/">${i+1}</a></div>
             <div id="boxu"><a href="https://leetcode.com/${arr[i].username}/">${arr[i].username}</a></div>
             <div id="boxu"><a href="https://leetcode.com/${arr[i].username}/">${arr[i].year}</a></div>
             <div id="boxu"><a href="https://leetcode.com/${arr[i].username}/">${arr[i].ranking} </a></div>
             <div id="boxu"><a href="https://leetcode.com/${arr[i].username}/">${arr[i].contribution_points}</a></div>
             <div id="boxu"><a href="https://leetcode.com/${arr[i].username}/">${arr[i].acceptance_rate}</a></div>
             <div id="boxn"><a href="https://leetcode.com/${arr[i].username}/">${arr[i].total_problems_solved}</a> </div>
             </div>`;
                    container.innerHTML += html;
                }
            }

        }
    });
}
getTxt(1, 1);