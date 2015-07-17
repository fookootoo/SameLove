angular.module('starter')
    .constant('API_URL',{
        baseUrl:'http://172.25.206.1/'
    })
    .constant('errorMessages',{
        // 1001 ~ 1999 , 与用户相关的错误
        1001: '您尚未登录，请登录',
        1002:'用户名或密码错误',
        1004: '您的money不够啦',

        1101:'用户名已被使用',
        1102:'邮箱已被使用',
        1103:'用户名格式错误',
        1104:'邮箱格式错误',

        1201:'您的积分不足，无法进行此操作',
        1202:'请不要发言过快，上次发言30秒后方可继续',

        1301:'您输入的密码不正确，无法修改密码',

        2001: '没有找到相关贴子'
//            2001: '这个话题没找到'
    })

    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin: 'admin_role',
        public: 'public_role'
    });