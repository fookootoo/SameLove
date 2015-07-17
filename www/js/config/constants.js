angular.module('starter')
    .constant('API_URL',{
        baseUrl:'http://172.25.206.1/'
    })
    .constant('errorMessages',{
        // 1001 ~ 1999 , ���û���صĴ���
        1001: '����δ��¼�����¼',
        1002:'�û������������',
        1004: '����money������',

        1101:'�û����ѱ�ʹ��',
        1102:'�����ѱ�ʹ��',
        1103:'�û�����ʽ����',
        1104:'�����ʽ����',

        1201:'���Ļ��ֲ��㣬�޷����д˲���',
        1202:'�벻Ҫ���Թ��죬�ϴη���30��󷽿ɼ���',

        1301:'����������벻��ȷ���޷��޸�����',

        2001: 'û���ҵ��������'
//            2001: '�������û�ҵ�'
    })

    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin: 'admin_role',
        public: 'public_role'
    });