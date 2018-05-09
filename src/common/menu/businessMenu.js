//运营的菜单
export const businessMenu = [
    {
        path: '/cms',
        name: '内容管理',
        iconClass: 'fa fa-book',
        children: [
            {path: '/content/protocols', name: '协议管理'},
            {path: '/content/helps', name: '帮助管理'},
            {path: '/content/articles', name: '文章管理'},
            {path: '/content/others', name: '其他管理'}
        ]
    }
];