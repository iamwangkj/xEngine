const HOST = 'http://192.168.0.113';
// const HOST = window.location.origin;
new Vue({
    el: '#app',
    data: {
        ruleForm: {
            username: '',
            password: ''
        }
    },
    created: function(){
        let uname = localStorage.getItem('ms_username');
        if (uname) {this.ruleForm.username = uname;}
    },
    methods: {
        submitForm: function(){
            const self = this;
            let uname = this.ruleForm.username;
            let pwd = md5(this.ruleForm.password);            
            console.log('submitForm--login', uname, pwd);
            $.ajax({
                url: HOST+'/admin/session',
                type: 'POST',
                data: {user: uname, password: pwd},
                success: function () {
                    localStorage.setItem('ms_username', uname);
                    window.location.href = HOST+'/html/index';
                },
                fail: function () {
                    self.$message.error('账号或密码错误，请重新输入');
                }
            });
            
        }
    }
});