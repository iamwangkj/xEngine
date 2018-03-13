const HOST = 'http://192.168.0.114';

window.onpopstate = function (event){
    console.log('popstate state=', event.state);
    $('.el-menu-item').removeClass('is-active');
    $('#'+event.state).addClass('is-active');
    $('.page').hide();
    switch(event.state){
        case '1-1':
            $('#page-groups').slideDown();
            component_groups.getData();
            break;
        case '1-1-1':
            $('#page-group-detail').slideDown();
            break;
        case '1-2':
            $('#page-fields').slideDown();
            component_fields.getData();
            break;
        case '1-2-1':
            $('#page-field-detail').slideDown();
            break;
        case '1-3':
            $('#page-subfields').slideDown();
            component_subfields.getData();
            break;
        case '1-3-1':
            // component_subfielddetail.getData(row);
            $('#page-subfield-detail').slideDown();
            break;
        case '2-1':
            $('#page-wechataccounts').slideDown();
            component_wechataccounts.getData(1);
            break;
        case '2-1-1':
            $('#page-wechataccount-detail').slideDown();
            // component_wechataccountdetail.getData(row);
            break;
        case '2-2':
            $('#page-clusters').slideDown();
            // component_wechataccounts.getData(1);
            break;
        case '2-2-1':
            $('#page-cluster-detail').slideDown();
            break;
        case '3-1':
            $('#page-packserver').slideDown();
            break;
        case '3-1-1':
            $('#page-packserver-detail').slideDown();
            break;
        case '4':
            $('#page-sysfix').slideDown();
            break;
        case '4-1':

            break;
        default:
            $('#1-1').addClass('is-active');
            $('#page-groups').slideDown();
            component_groups.getData();
            break;
    }
    
}

function goto(_index, _item) {
    console.log('goto--', _index, _item);
	$('.page').hide();
	switch(_index){
		case '1-1':
			$('#page-groups').slideDown();
			component_groups.getData();
			break;
        case '1-1-1':
            $('#page-group-detail').slideDown();
            component_groupdetail.getData(_item);
            break;
		case '1-2':
			$('#page-fields').slideDown();
			component_fields.getData();
			break;
        case '1-2-1':
            component_fielddetail.getData(_item);
            $('#page-field-detail').slideDown();
            break;
		case '1-3':
			$('#page-subfields').slideDown();
			component_subfields.getData();
			break;
        case '1-3-1':
            component_subfielddetail.getData(_item);
            $('#page-subfield-detail').slideDown();
            break;
		case '2-1':
			$('#page-wechataccounts').slideDown();
			component_wechataccounts.getData(1);
			break;
        case '2-1-1':
            $('#page-wechataccount-detail').slideDown();
            component_wechataccountdetail.getData(_item);
            break;
        case '2-2':
            $('#page-clusters').slideDown();
            component_cluster.getData();
            break;
        case '2-2-1':
            $('#page-cluster-detail').slideDown();
            component_clusterdetail.getData(_item);
            break;
        case '3-1':
            $('#page-packserver').slideDown();
            component_packserver.getData();
            break;
        case '3-1-1':
            $('#page-packserver-detail').slideDown();
            break;
        case '4':
            $('#page-sysfix').slideDown();
            // component_wechataccounts.getData(1);
            break;
        case '4-1':

            break;
		default:
			//code
	}
    // 记录进栈
    var urlArr = window.location.href.split('?');
    if (!urlArr[1]) {
        window.history.pushState(_index, null, '?'+_index);
    }
    else if (urlArr[1] && urlArr[1] != _index) {
        window.history.pushState(_index, null, '?'+_index);
    }
}


// header
var component_header = new Vue({
    el: '#header',
    data: function() {
        return {
            default_name: '默认名称1'
        };
    },
    computed: {
        username: function() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.default_name;
        }
    },
    methods: {
        handleCommand: function() {
            window.location.href = HOST + '/html/login';
        }
    }
});

// sidebar
var component_sidebar = new Vue({
    el: '#sidebar',
    methods: {
        goto: function(_index) {
            goto(_index);
        }
    }
});


var component_groups = new Vue({
    el: '#page-groups',
    data: {
        tableData: [],
        modal_isShow: false,
        add_group_name: '',
        add_group_desc: '',
        add_group_fields: [],

        selectableFields: [],
        selectedFields: []
    },
    computed: {
        modal_fields: function() {
            let arr = this.fields;
            for (var i = 0; i < arr.length; i++) {
                arr[i].isSelected = false;
            }
            return arr;
        }
    },
    created: function() {
        this.getData();
    },
    methods: {
    	getData: function() {
    	    const self = this;
    	    let url = HOST+'/admin/groups';
    	    $.ajax({
    	    	type: 'GET',
    	    	url: url,
    	    	success: function (data, textStatus) {
    	    		console.log('groups get data', textStatus);
    	    		console.log(data);
    	    		self.tableData = data.groups;
    	    	},
    	    	error: function (jqXHR, textStatus) {
    	    		alert(textStatus);
    	    	}
    	    });
    	},
        handleEdit: function(_item) {
            console.log('handleEdit', _item);
            goto('1-1-1', _item);
        },
        handleDelete: function(_item) {
        	console.log('handleDelete', _item);
        	// var evt = e || window.event;
        	// // console.log('event', evt);
        	// if ( evt && evt.stopPropagation )
	        // 	evt.stopPropagation();	//因此它支持W3C的stopPropagation()方法
	        // else
	        // 	window.event.cancelBubble = true;	//否则，我们需要使用IE的方式来取消事件冒泡
            
            const self = this;
            self.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
            	let groupid = _item.id;
                let url = HOST + '/admin/groups/'+groupid;
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    success: function(data, textStatus) {
                        console.log(' del data', textStatus);
                        self.$message.error('删除了：'+_item.name);
                        // self.tableData.splice(index, 1);
                        let arrRes = $.grep(self.tableData, function (_n, _i) {
                        	return _n.id == groupid;
                        }, true);
                        self.tableData = arrRes;
                    },
                    error: function(jqXHR, textStatus) {
                        self.$message.error('删除失败');
                    }
                });
            }).catch(function(){});
        },
        showModal: function() {
            this.modal_isShow = !this.modal_isShow;
            this.modalGetFields();
        },
        hideModal: function() {
            this.modal_isShow = !this.modal_isShow;
            this.add_group_name = '';
            this.add_group_desc = '';
            this.add_group_fields = [];
            this.selectedFields = [];
        },
        modalGetFields: function() {
            const self = this;
            let url = HOST + '/admin/fields';
            $.ajax({
                type: 'GET',
                url: url,
                success: function(data, textStatus) {
                    console.log('modalGetFields get data', textStatus);
                    console.log(data);
                    self.selectableFields = data.fields;
                },
                error: function(jqXHR, textStatus) {
                    alert(textStatus);
                }
            });
        },
        modalSelectField: function(_item) {
        	console.log('modal select', _item);
            const self = this;
            if ( $.inArray(_item, self.selectedFields) == -1 ) {
            	self.selectedFields.push(_item);
            }
        },
        modalRemoveField: function(_item){
        	console.log('modalRemoveField', _item);
        	const self = this;
        	self.selectedFields = $.grep(self.selectedFields, function (_n, _i) {
        		return _n == _item;
        	}, true);
        },
        isNull: function( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        addGroup: function() {
            console.log('addGroup');
            const self = this;
            if (self.isNull(self.add_group_name)) {
            	self.$message.error('名称不能为空');
            	return false;
            }
            let idArr = [];
            for (var i = 0; i < self.selectedFields.length; i++) {
                idArr.push(self.selectedFields[i].id);
            }
            let url = HOST + '/admin/groups';
            let formData = {
                name: self.add_group_name,
                description: self.add_group_desc,
                fields: idArr.join('.')
            };
            console.log('addGroup formData', formData);
            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                statusCode: {
                	209: function() {
                		self.$message.error('已存在');
                	}
                },
                success: function(data, textStatus) {
                    console.log(' add data', textStatus);
                    console.log(data);
                    self.hideModal();
                    self.$message.success('添加成功');
                    self.getData();
                },
                error: function(jqXHR, textStatus) {
                    self.$message.error('添加失败');
                }
            });
        },
    }
});
var component_groupdetail = new Vue({
    el: '#page-group-detail',
    data: {
        detailData: [],
        id: '',
        name: '',
        desc: '',
        fields: [],

        group_detail_name_inputVisible: false,
        group_detail_desc_inputVisible: false,
        group_detail_name: '',
        group_detail_desc: '',
        modal_isShow: false,
        fieldsSelectable: [],
        fieldsSelected: [],
    },
    computed:{
    	formData: function(){
    		let id_fields = []
    		for (var i = 0; i < this.fields.length; i++) {
    			id_fields.push(this.fields[i].id);
    		}
    		return {
    			name: this.name,
    			description: this.desc,
    			fields: id_fields.join('.')
    		}
    	}
    },
    methods: {
        handleCurrentChange: function(val) {
            this.cur_page = val;
            this.getData();
        },
        getData: function(_item) {
            console.log('group get data', _item);
            const self = this;
            let groupid = _item.id;
            let url = HOST+'/admin/groups/'+groupid;
            $.ajax({
            	type: 'GET',
            	url: url,
            	success: function (data, textStatus) {
            		console.log('group detail get data', textStatus);
            		console.log(data);
            		self.detailData = data;
            		self.id = data.id;
            		self.name = data.name;
            		self.desc = data.desc;
            		self.fields = data.fields;
            	},
            	error: function (jqXHR, textStatus) {
            		alert(textStatus);
            	}
            });
        },
        delField: function(_item){
        	console.log('del', _item);
        	this.fields = $.grep(this.fields, function(_n, _i){
        		return _n == _item;
        	}, true);
        },
        showNameInput: function(){
        	this.group_detail_name_inputVisible = true;
        	this.group_detail_name = this.detailData.name;
        },
        showDescInput: function(){
        	this.group_detail_desc_inputVisible = true;
        	this.group_detail_desc = this.detailData.desc;
        },
        showModal: function() {
            this.modal_isShow = !this.modal_isShow;
            this.modalGetSelectableFields();
        },
        hideModal: function() {
            this.modal_isShow = !this.modal_isShow;
            this.fieldsSelected = [];
        },
        modalGetSelectableFields: function(){
        	const self = this;
        	let allFields = component_fields.tableData;
        	let ownedFields = self.fields;
        	for (var i = 0; i < ownedFields.length; i++) {
        		allFields = $.grep(allFields, function(_n, _i){
        			return _n.id == ownedFields[i].id;
        		}, true);
        	}
        	self.fieldsSelectable = allFields;
        },
        modalSelectField: function(_item){
        	console.log('modalSelectField', _item);
        	const self = this;
        	if ( $.inArray(_item, self.fieldsSelected) == -1 ) {
        		self.fieldsSelected.push(_item);
        	}
        },
        modalRemoveField: function(_item){
        	console.log('modalRemoveField', _item);
        	const self = this;
        	self.fieldsSelected = $.grep(self.fieldsSelected, function (_n, _i) {
        		return _n == _item;
        	}, true);
        },
        modalAddField: function(){
        	console.log('groupAddField');
        	this.fields = this.fields.concat(this.fieldsSelected);
        	this.fieldsSelected = [];
        	this.hideModal();
        },
        isNull: function( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        update: function(){
        	const self = this;
            if (self.isNull(self.name)) {
                self.$message.error('名称不能为空');
                return false;
            }
        	console.log('update', self.formData);
        	self.$confirm('是否保存?', '提示', {
        	    confirmButtonText: '确定',
        	    cancelButtonText: '取消',
        	    type: 'warning'
        	}).then(function(){
        		let groupid = self.id;
        	    let url = HOST+'/admin/groups/'+groupid;
        	    $.ajax({
        	    	type: 'PUT',
        	    	url: url,
        	    	data: self.formData,
        	    	success: function (data, textStatus) {
        	    		console.log('update', textStatus);
        	    		self.$message.success('保存成功');
        	    	},
        	    	error: function (jqXHR, textStatus) {
        	    		self.$message.error('保存失败');
        	    	}
        	    });
        	}).catch(function(){});
        },
        cancelUpdate: function(){
            const self = this;
            self.$confirm('如您修改的内容未保存，是否直接返回?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                goto('1-1');
            }).catch(function(){});
        	
        }

    }
});

var component_fields = new Vue({
    el: '#page-fields',
    data: function() {
        return {
            tableData: [],
            // cur_page: 1,
            add_field_name: '',
            add_field_keyword: '',
            add_field_keyword_inputVisible: false,
            add_field_selected_keywords: [],
            add_field_desc: '',

            modal_isShow: false,
            multipleSelection: [],
            // select_cate: '',
            // select_word: '',
            // del_list: [],
            // is_search: false,
        }
    },
    created: function() {
        this.getData();
    },
    methods: {
        handleClose: function(tag) {
            this.add_field_selected_keywords.splice(this.add_field_selected_keywords.indexOf(tag), 1);
        },
        showInput: function() {
            this.add_field_keyword_inputVisible = true;
            this.$nextTick(function(){
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm: function() {
            let add_field_keyword = this.add_field_keyword;
            if (add_field_keyword) {
                this.add_field_selected_keywords.push(add_field_keyword);
            }
            this.add_field_keyword_inputVisible = false;
            this.add_field_keyword = '';
        },
        handleCurrentChange: function(val) {
            this.cur_page = val;
            this.getData();
        },
        getData: function() {
            const self = this;
            let url = HOST + '/admin/fields';
            $.ajax({
                type: 'GET',
                url: url,
                statusCode: {
                    409: function () {
                        self.$message.error('已存在该项');
                    }
                },
                success: function(data, textStatus) {
                    console.log('fields get data');
                    console.log(data);
                    self.tableData = data.fields;
                },
                error: function(jqXHR, textStatus) {
                    // alert(textStatus);
                }
            });
        },
        handleEdit: function(index, row) {
            console.log('handleEdit', index, row);
            goto('1-2-1', row);
        },
        handleDelete: function(index, row) {
            console.log('field del row', row);
            const self = this;
            self.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                let fieldid = row.id;
                let url = HOST + '/admin/fields/' + fieldid;
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    success: function(data, textStatus) {
                        console.log(' del data', textStatus);
                        self.$message.error('删除成功');
                        self.tableData.splice(index, 1);
                    },
                    error: function(jqXHR, textStatus) {
                        self.$message.error('删除失败');
                    }
                });
            }).catch(function(){});
        },
        handleSelectionChange: function(val) {
            console.log('handleSelectionChange', val);
            this.multipleSelection = val;
        },
        delAll: function() {
            const self = this;
            if (self.multipleSelection.length == 0) {
            	self.$message.info('请勾选所需要删除的项');
            	return false;
            }
            self.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                var tmp_multipleSelection = self.multipleSelection;//解决网络差的时候无法删除后面几项
            	let len = tmp_multipleSelection.length;
                console.log('wangkj--field len=', len);
                for (let i = 0; i < len; i++) {
                    console.log('wangkj--len='+len+'--tmp_multipleSelection['+i+']=', tmp_multipleSelection[i]);
                    let fieldid = tmp_multipleSelection[i].id;
                    let url = HOST + '/admin/fields/' + fieldid;
                    $.ajax({
                    	// async: false,	//同步
                        type: 'DELETE',
                        url: url,
                        success: function(data, textStatus) {
                            console.log(' del data', textStatus);
                            self.$message.error('删除成功');
                            self.getData();
                            // let arrRes = $.grep(self.tableData, function(currItem){
                            // 	return currItem.id == self.multipleSelection[i].id;
                            // }, true);
                            // self.tableData = arrRes;
                        },
                        error: function(jqXHR, textStatus) {
                            self.$message.error('删除失败');
                        }
                    });
                }
            }).catch(function(){});
        },
        showModal: function() {
            this.modal_isShow = !this.modal_isShow;
        },
        hideModal: function() {
            this.modal_isShow = !this.modal_isShow;
            this.add_field_name = '';
            this.add_field_keyword = '';
            this.add_field_selected_keywords = [];
            this.add_field_desc = '';
        },
        isNull: function( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        addfield: function() {
            console.log('add fields');
            const self = this;
            if (self.isNull(self.add_field_name)) {
            	self.$message.error('名称不能为空');
            	return false;
            }
            let url = HOST + '/admin/fields';
            let formData = {
                name: self.add_field_name,
                description: self.add_field_desc,
                keywords: self.add_field_selected_keywords.join('.'),
                subfields: '',
                belongs: ''
            };
            console.log(url, formData);
            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                success: function(data, textStatus) {
                    console.log('field add', textStatus);
                    console.log(data);
                    // self.tableData = data.fields;
                    self.hideModal();
                    self.getData();
                },
                error: function(jqXHR, textStatus) {
                    alert(jqXHR.status);
                }
            });

        },
    }
});

var component_fielddetail = new Vue({
    el: '#page-field-detail',
    data: {
        detailData: [],
        name: '',
        keywords: [],
        desc: '',
        belongs: [],
        subfields: [],


        keyword_inputVisible: false,
        keyword_inputValue: '',

        modal_isShow_group: false,
        modal_isShow_subfield: false,
        modalSelectableGroups: [],
        modalSelectedGroups: [],
        modalSelectableSubfields: [],
        modalSelectedSubfields: []
    },
    computed:{
    	formData: function(){
    		let id_subfields = [];
    		for (var i = 0; i < this.subfields.length; i++) {
    			id_subfields.push(this.subfields[i].id);
    		}
    		let id_belongs = [];
    		for (var i = 0; i < this.belongs.length; i++) {
    			id_belongs.push(this.belongs[i].id);
    		}
    		return {
    			name: this.name,
    			description: this.desc,
    			keywords: this.keywords.join('.'),
    			subfields: id_subfields.join('.'),
    			belongs: id_belongs.join('.')
    		};
    	}
    },
    methods: {
        getData: function(_item) {
        	console.log('field detail get data', _item);
            const self = this;
            let fieldid = _item.id;
            let url = HOST+'/admin/fields/'+fieldid;
            $.ajax({
            	type: 'GET',
            	url: url,
            	success: function (data, textStatus) {
            		console.log('field detail 2 get data', textStatus);
            		console.log(data);
            		self.detailData = data;
            		self.name = data.name;
            		self.keywords = data.keywords;
            		self.desc = data.desc;
            		self.belongs = data.belongs;
            		self.subfields = data.subfields;
            	},
            	error: function (jqXHR, textStatus) {
            		alert(textStatus);
            	}
            });
        },
        delKeyword: function(_item){
        	console.log('del', _item);
        	this.keywords = $.grep(this.keywords, function(_n, _i){
        		return _n == _item;
        	}, true);
        },
        handleInputConfirm: function(){
        	let inputValue = this.keyword_inputValue;
	        if (inputValue) {
	        	this.keywords.push(inputValue);
	        }
	        this.keyword_inputVisible = false;
	        this.keyword_inputValue = '';
        },
        showInput: function(){
        	this.keyword_inputVisible = true;
	        this.$nextTick(function(){
	        	this.$refs.saveTagInput.$refs.input.focus();
	        });
        },
        delBelongs: function(_item){
        	console.log('del', _item);
        	this.belongs = $.grep(this.belongs, function(_n, _i){
        		return _n == _item;
        	}, true);
        },
        delSubfields: function(_item){
        	console.log('del', _item);
        	this.subfields = $.grep(this.subfields, function(_n, _i){
        		return _n == _item;
        	}, true);
        },
        showModal: function(_name) {
            if (_name == 'group') {
            	this.modal_isShow_group = true;
            	this.modalGetSelectableGroups();
            }
            else if (_name == 'subfield') {
            	this.modal_isShow_subfield = true;
            	this.modalGetSelectableSubfields();
            }
        },
        hideModal: function(_name) {
            if (_name == 'group') {
            	this.modal_isShow_group = false;
            	this.modalSelectedGroups = [];
            }
            else if (_name == 'subfield') {
            	this.modal_isShow_subfield = false;
            	this.modalSelectedSubfields = [];
            }
        },
        modalGetSelectableGroups: function(){
        	const self = this;
        	let allGroups = component_groups.tableData;
        	let ownedGroups = self.belongs;
        	console.log('allGroups', allGroups, 'ownedGroups', ownedGroups);
        	for (var i = 0; i < ownedGroups.length; i++) {
        		allGroups = $.grep(allGroups, function(_n, _i){
        			return _n.id == ownedGroups[i].id;
        		}, true);
        	}
        	self.modalSelectableGroups = allGroups;
        	console.log('self.modalSelectableGroups', self.modalSelectableGroups);
        },
        modalSelectGroup: function(_item){
        	console.log('modalSelectGroup', _item);
        	const self = this;
        	if ( $.inArray(_item, self.modalSelectedGroups) == -1 ) {
        		self.modalSelectedGroups.push(_item);
        	}
        },
        modalRemoveGroup: function(_item){
        	console.log('modalRemoveGroup', _item);
        	const self = this;
        	self.modalSelectedGroups = $.grep(self.modalSelectedGroups, function (_n, _i) {
        		return _n == _item;
        	}, true);
        },
        modalAddGroup: function(){
        	this.belongs = this.belongs.concat(this.modalSelectedGroups);
        	this.modalSelectedGroups = [];
        	this.hideModal('group');
        },
        modalGetSelectableSubfields: function(){
        	const self = this;
        	let allSubfields = component_subfields.tableData;
        	let ownedSubfields = self.subfields;
        	for (var i = 0; i < ownedSubfields.length; i++) {
        		allSubfields = $.grep(allSubfields, function(_n, _i){
        			return _n.id == ownedSubfields[i].id;
        		}, true);
        	}
        	self.modalSelectableSubfields = allSubfields;
        },
        modalSelectSubfield: function(_item){
        	console.log('modal select', _item);
        	const self = this;
        	if ( $.inArray(_item, self.modalSelectedSubfields) == -1 ) {
        		self.modalSelectedSubfields.push(_item);
        	}
        },
        modalRemoveSubfield: function(_item){
        	console.log('remove', _item);
        	const self = this;
        	self.modalSelectedSubfields = $.grep(self.modalSelectedSubfields, function (_n, _i) {
        		return _n == _item;
        	}, true);
        },
        modalAddSubfields: function(){
        	this.subfields = this.subfields.concat(this.modalSelectedSubfields);
        	this.modalSelectedSubfields = [];
        	this.hideModal('subfield');
        },
        isNull: function( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        update: function(){
        	console.log('update');
        	const self = this;
            if (self.isNull(self.name)) {
                self.$message.error('名称不能为空');
                return false;
            }
        	self.$confirm('是否保存?', '提示', {
        	    confirmButtonText: '确定',
        	    cancelButtonText: '取消',
        	    type: 'warning'
        	}).then(function(){
        	    let fieldid = self.detailData.id;
        	    let url = HOST+'/admin/fields/'+fieldid;
        	    $.ajax({
        	    	type: 'PUT',
        	    	url: url,
        	    	data: self.formData,
        	    	success: function (data, textStatus) {
        	    		self.$message.success('保存成功');
        	    	},
        	    	error: function (jqXHR, textStatus) {
        	    		self.$message.error('保存失败');
        	    	}
        	    });
        	}).catch(function(){});
        },
        cancelUpdate: function(){
            const self = this;
            self.$confirm('如您修改的内容未保存，是否直接返回?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                goto('1-2');
            }).catch(function(){});
        	
        }
    }
});

var component_subfields = new Vue({
    el: '#page-subfields',
    data: function() {
        return {
            tableData: [],
            cur_page: 1,
            modal_isShow: false,

            add_subfield_name: '',
            add_subfield_keyword: '',
            add_subfield_keyword_inputVisible: false,
            add_subfield_keywords: [],
            add_subfield_desc: '',

            multipleSelection: [],
            // delOneByOne_arr: [],


            delOneByOne_id: '',
            delOneByOne_index: 0,
        }
    },
    created: function() {
        this.getData();
    },
    methods: {
        handleClose: function(tag) {
            this.add_subfield_keywords.splice(this.add_subfield_keywords.indexOf(tag), 1);
        },

        showInput: function() {
            this.add_subfield_keyword_inputVisible = true;
            this.$nextTick(function(){
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm: function() {
            let add_subfield_keyword = this.add_subfield_keyword;
            if (add_subfield_keyword) {
                this.add_subfield_keywords.push(add_subfield_keyword);
            }
            this.add_subfield_keyword_inputVisible = false;
            this.add_subfield_keyword = '';
        },
        handleCurrentChange: function(val) {
            this.cur_page = val;
            this.getData();
        },
        getData: function() {
            const self = this;
            let url = HOST + '/admin/subfields';
            console.log('subfields--getData--url', url);
            $.ajax({
                type: 'GET',
                url: url,
                success: function(data, textStatus) {
                    console.log('subfields get data', textStatus);
                    console.log(data);
                    self.tableData = data.subfields;
                },
                error: function(jqXHR, textStatus) {
                    alert(textStatus);
                }
            });
        },
        handleEdit: function(index, row) {
            console.log('handleEdit', index, row);
            goto('1-3-1', row);
        },
        handleDelete: function(index, row) {
            const self = this;
            self.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                console.log('del subfield row', row);
                let subfieldid = row.id;
                let url = HOST + '/admin/subfields/' + subfieldid;
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    success: function(data, textStatus) {
                        console.log(' del data', textStatus);
                        self.$message.error('删除成功');
                        self.tableData.splice(index, 1);
                    },
                    error: function(jqXHR, textStatus) {
                        self.$message.error('删除失败');
                    }
                });
            }).catch(function(){});
        },
        handleSelectionChange: function(val) {
            console.log('handleSelectionChange', val);
            this.multipleSelection = val;
        },
        delAll: function() {
            const self = this;
            if (self.multipleSelection.length == 0) {
            	self.$message.info('请勾选所需要删除的项');
            	return false;
            }
            self.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                var tmp_multipleSelection = self.multipleSelection;//解决网络差的时候无法删除后面几项
                let len = tmp_multipleSelection.length;
                for (let i = 0; i < len; i++) {
                    console.log('wangkj--len='+len+'--tmp_multipleSelection['+i+']=', tmp_multipleSelection[i]);
                    let subfieldid = tmp_multipleSelection[i].id;
                    let url = HOST + '/admin/subfields/' + subfieldid;
                    $.ajax({
                        // async: false, //同步
                        type: 'DELETE',
                        url: url,
                        success: function(data, textStatus) {
                            console.log(' del data', textStatus);
                            self.$message.error('删除成功');
                            self.getData();
                            // let arrRes = $.grep(self.tableData, function(currItem) {
                            //     return currItem.id == self.multipleSelection[i].id;
                            // }, true);
                            // self.tableData = arrRes;
                        },
                        error: function(jqXHR, textStatus) {
                            self.$message.error('删除失败');
                        }
                    });
                }
                
            });
        },
        selectTag: function(_item) {
            _item.isActive = !_item.isActive;
        },
        delTag: function(_item) {
            _item.isActive = !_item.isActive;
        },
        showModal: function() {
            this.modal_isShow = !this.modal_isShow;
        },
        hideModal: function() {
            this.modal_isShow = !this.modal_isShow;
            this.add_subfield_name = '';
            this.add_subfield_keyword = '';
            this.add_subfield_keyword_inputVisible = false;
            this.add_subfield_keywords = [];
            this.add_subfield_desc = '';
        },
        isNull: function( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        addSubfield: function() {
            const self = this;
            if (self.isNull(self.add_subfield_name)) {
            	self.$message.error('名称不能为空');
            	return false;
            }
            let url = HOST + '/admin/subfields';
            let formData = {
                name: self.add_subfield_name,
                description: self.add_subfield_desc,
                keywords: self.add_subfield_keywords.join('.'),
                belongs: ''
            };
            console.log('addSubfield formData', formData);
            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                statusCode: {
                    409: function () {
                        self.$message.error('已存在该项');
                    }
                },
                success: function(data, textStatus) {
                    console.log('subfields add', textStatus);
                    console.log(data);
                    self.getData();
                    self.hideModal();
                    self.add_subfield_name = ''
                    self.add_subfield_keyword = ''
                    self.add_subfield_keywords = []
                    self.add_subfield_desc = ''
                },
                error: function(jqXHR, textStatus) {
                    // alert(textStatus);
                }
            });
        },
    }
});

var component_subfielddetail = new Vue({
    el: '#page-subfield-detail',
    data: {
        detailData: [],
        name: '',
        keywords: [],
        desc: '',
        belongs: [],
        accounts: [],

        keyword_inputVisible: false,
        keyword_inputValue: '',

        modal_isShow_fields: false,
        modal_isShow_accounts: false,
        modalSelectableFields: [],
        modalSelectedFields: [],
        cur_page: 1,
        isReachEnd: false,
        allAccounts: [],
        modalSelectableAccounts: [],
        modalSelectedAccounts: []
    },
    computed: {
    	formData: function(){
    		let id_belongs = [];
    		for (var i = 0; i < this.belongs.length; i++) {
    			id_belongs.push(this.belongs[i].id);
    		}
    		return {
    			name: this.name,
    			description: this.desc,
    			keywords: this.keywords.join('.'),
    			belongs: id_belongs.join('.')
    		};
    	}
    },
    methods: {
        getData: function(_item) {
        	console.log('subfield detail get data', _item);
            const self = this;
            let subfieldid = _item.id;
            let url = HOST+'/admin/subfields/'+subfieldid;
            $.ajax({
            	type: 'GET',
            	url: url,
            	success: function (data, textStatus) {
            		console.log('subfield detail 2 get data', textStatus);
            		console.log(data);
            		self.detailData = data;
            		self.name = data.name;
            		self.keywords = data.keywords;
            		self.desc = data.desc;
            		self.belongs = data.belongs;
            	},
            	error: function (jqXHR, textStatus) {
            		alert(textStatus);
            	}
            });

            $.ajax({
            	type: 'GET',
            	url: HOST+'/admin/subfields/'+subfieldid+'/wechataccounts',
            	success: function (data, textStatus) {
            		console.log(' get data', textStatus);
            		console.log(data);
            		self.accounts = data.accounts;
            	},
            	error: function (jqXHR, textStatus) {
            		alert(textStatus);
            	}
            });
        },
        delKeyword: function(_item){
        	console.log('del', _item);
        	this.keywords = $.grep(this.keywords, function(_n, _i){
        		return _n == _item;
        	}, true);
        },
        handleInputConfirm: function(){
        	let inputValue = this.keyword_inputValue;
	        if (inputValue) {
	        	this.keywords.push(inputValue);
	        }
	        this.keyword_inputVisible = false;
	        this.keyword_inputValue = '';
        },
        showInput: function(){
        	this.keyword_inputVisible = true;
	        this.$nextTick(function(){
	        	this.$refs.saveTagInput.$refs.input.focus();
	        });
        },
        delField: function(_item){
        	console.log('del', _item);
        	this.belongs = $.grep(this.belongs, function(_n, _i){
        		return _n == _item;
        	}, true);
        },
        delAccount: function(_item){
        	console.log('del', _item);
        	this.accounts = $.grep(this.accounts, function(_n, _i){
        		return _n == _item;
        	}, true);
        },
        showModal: function(_index){
        	if (_index == 'fields') {
        		this.modal_isShow_fields = true;
        		this.modalGetSelectableFields();
        	}
        	else if (_index == 'accounts') {
        		this.modal_isShow_accounts = true;
        		this.modalGetSelectableAccounts(1);
        	}
        },
        hideModal: function(_index){
        	if (_index == 'fields') {
        		this.modal_isShow_fields = false;
        		this.modalSelectedFields = [];
        	}
        	else if (_index == 'accounts') {
        		this.modal_isShow_accounts = false;
        		this.modalSelectedAccounts = [];
        	}
        },
        modalGetSelectableFields: function(){
        	const self = this;
        	let allFields = component_fields.tableData;
        	console.log('allFields');
        	let ownedFields = self.belongs;
        	for (var i = 0; i < ownedFields.length; i++) {
        		allFields = $.grep(allFields, function(_n, _i){
        			return _n.id == ownedFields[i].id;
        		}, true);
        	}
        	self.modalSelectableFields = allFields;
        },
        modalSelectField: function(_item){
        	console.log('modal select', _item);
        	const self = this;
        	if ( $.inArray(_item, self.modalSelectedFields) == -1 ) {
        		self.modalSelectedFields.push(_item);
        	}
        },
        modalRemoveField: function(_item){
        	console.log('modal remove', _item);
        	const self = this;
        	self.modalSelectedFields = $.grep(self.modalSelectedFields, function (_n, _i) {
        		return _n == _item;
        	}, true);
        },
        modalAddFields: function(){
        	this.belongs = this.belongs.concat(this.modalSelectedFields);
        	this.modalSelectedFields = [];
        	this.hideModal('fields');
        },
        modalGetSelectableAccounts: function(_cur_page){
        	const self = this;
            let pagesize = 20; //每次加载的数量
            if (!_cur_page || _cur_page == 1) {//第一页进来，清空原来的数据
                self.modalSelectableAccounts = [];
                self.cur_page = 1;
            }
            let index =  pagesize * (self.cur_page - 1);
            let url = HOST + '/admin/wechataccounts/cursor/' + index + '/limit/' + pagesize;
            console.log('detail--subfield--accounts--getData--url', url);
            $.ajax({
                type: 'GET',
                url: url,
                statusCode: {
                    200: function(data) {
                        console.log('detail--subfield--accounts--get data=', data);
                        if (data.accounts.length < pagesize) {
                            self.isReachEnd = true;
                        }
                        else{
                            self.isReachEnd = false;
                        }
                        self.allAccounts = self.allAccounts.concat(data.accounts);
                        self.$nextTick(function() {
                            $('#selectedAccountWrap').bind('scroll', function() {
                                if (!self.isReachEnd && self.isScrollToBottom()) {
                                    self.cur_page++;
                                    self.modalGetSelectableAccounts(self.cur_page);
                                }
                            });
                        });
                        console.log('detail--subfield--accounts--self.allAccounts=', self.allAccounts);
                        let ownedAccounts = self.accounts;
                        for (var i = 0; i < ownedAccounts.length; i++) {
                            self.allAccounts = $.grep(self.allAccounts, function(_n, _i){
                                return _n.id == ownedAccounts[i].id;
                            }, true);
                        }
                        self.modalSelectableAccounts = self.allAccounts;
                    },
                    400: function() {
                        self.$message.error('参数错误');
                    }
                }
            });

        },
        isScrollToBottom: function() {
            var scrollTop = $('#selectedAccountWrap').scrollTop(); //Y轴上溢出（滚动）的距离
            var viewHeight = $('#selectedAccountWrap').height(); //可视区域的高度
            var allHeight = $('#selectedAccount').height(); //可视区域的高度加上溢出（滚动）的距离
            　　
            if (scrollTop + viewHeight == allHeight) { //到底
                $('#selectedAccount')[0].scrollTop -= 80; //滚动条回弹
                return true;　　
            } else {
                return false;
            }
        },
        modalSelectAccount: function(_item){
        	console.log('modal select', _item);
        	const self = this;
        	if ( $.inArray(_item, self.modalSelectedAccounts) == -1 ) {
        		self.modalSelectedAccounts.push(_item);
        	}
        },
        modalRemoveAccount: function(_item){
        	console.log('modal remove', _item);
        	const self = this;
        	self.modalSelectedAccounts = $.grep(self.modalSelectedAccounts, function (_n, _i) {
        		return _n == _item;
        	}, true);
        },
        modalAddAccounts: function(){
        	const self = this;
        	console.log('self.modalSelectedAccounts.length', self.modalSelectedAccounts.length);
        	if (self.modalSelectedAccounts.length>0) {
                for (var i = 0; i < self.modalSelectedAccounts.length; i++) {
                    let account = self.modalSelectedAccounts[i];
                    let accountid = account.id;
                    let subfieldid = self.detailData.id;
                    console.log('account', account);
                    $.ajax({
                        // async: false,
                        type: 'POST',
                        url: HOST+'/admin/subfields/'+subfieldid+'/wechataccounts/'+accountid,
                        success: function (data, textStatus) {
                            console.log('update', textStatus);
                            self.accounts.push(account);
                            self.hideModal('accounts');
                        },
                        error: function (jqXHR, textStatus) {
                            self.$message.error('添加所含公众号失败');
                        }
                    });
                }
            }
        },
        isNull: function( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        update: function(){
        	const self = this;
            if (self.isNull(self.name)) {
                self.$message.error('名称不能为空');
                return false;
            }
        	self.$confirm('是否保存?', '提示', {
        	    confirmButtonText: '确定',
        	    cancelButtonText: '取消',
        	    type: 'warning'
        	}).then(function(){
        		let subfieldid = self.detailData.id;
        		console.log('self.formData', self.formData, 'id', subfieldid);
        	    $.ajax({
        	    	type: 'PUT',
        	    	url: HOST+'/admin/subfields/'+subfieldid,
        	    	data: self.formData,
        	    	success: function (data, textStatus) {
        	    		self.$message.success('保存成功');
        	    	},
        	    	error: function (jqXHR, textStatus) {
        	    		self.$message.error('保存失败');
        	    	}
        	    });
        	}).catch(function(){});
        },
        cancelUpdate: function(){
            const self = this;
            self.$confirm('如您修改的内容未保存，是否直接返回?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                goto('1-3');
            }).catch(function(){});
        	
        }
    }
});

// wechataccounts
var component_wechataccounts = new Vue({
    el: '#page-wechataccounts',
    data: {
        tableData: [],
        tmpTableData: [],
        isReachEnd: false,
        cur_page: 1,
        multipleSelection: [],
        del_list: [],

        createAccountBoxIsShow: false,

        add_account_name: '',
        add_account_account: '',
        dropdown_show: false,
        dropdown_selectable: [{
                isSelected: false,
                name: '知乎',
                value: 'zhihu'
            },{
                isSelected: false,
                name: '豆瓣',
                value: 'douban'
            },{
                isSelected: false,
                name: '搜狐新闻',
                value: 'sohu'
            },{
                isSelected: false,
                name: '天天快报',
                value: 'qq'
            },{
                isSelected: false,
                name: '新浪新闻',
                value: 'weibo'
            },{
                isSelected: false,
                name: '一点资讯',
                value: 'yidian'
            },{
                isSelected: false,
                name: '今日头条',
                value: 'toutiao'
            },{
                isSelected: false,
                name: '凤凰新闻',
                value: 'fenghuang'
            }],
        dropdown_selected: [],
        level: 6,

        modalSelectableFields: [],
        modalSelectedField: null,

        modalSelectableSubfields: [],
        modalSelectedSubfields: [],

        kol_isSelect: false,
        modal_kol_isSelect: false,


    },
    computed: {
        modalSelectedWemedias: function(){
            const self = this;
            let arr = [];
            for (var i = 0; i < self.dropdown_selected.length; i++) {
                var platformname = '';
                console.log('self.dropdown_selected['+i+']', self.dropdown_selected[i]);
                switch(self.dropdown_selected[i]){
                    case '今日头条':
                        platformname = 'toutiao';
                        break;
                    case '天天快报':
                        platformname = 'qq';
                        break;
                    case '新浪新闻':
                        platformname = 'weibo';
                        break;
                    case '搜狐新闻':
                        platformname = 'sohu';
                        break;
                    case '一点资讯':
                        platformname = 'yidian';
                        break;
                    case '豆瓣':
                        platformname = 'douban';
                        break;
                    case '知乎':
                        platformname = 'zhihu';
                        break;
                    case '凤凰新闻':
                        platformname = 'fenghuang';
                        break;
                    default:
                        platformname = 'other';
                }
                console.log('platformname', platformname);
                let item_wemedia = {
                    label: this.dropdown_selected[i],
                    platform: platformname,
                    name: '',
                    link: ''
                };
                arr.push(item_wemedia);
            }
            console.log('arr', arr);
            return arr;
        },

    	formData: function(){
    		const self = this;
    		let id_fields = [];
    		for (var i = 0; i < self.modalSelectedSubfields.length; i++) {
    			id_fields.push(self.modalSelectedSubfields[i].id);
    		}
    		if (self.modal_kol_isSelect == true) {
    			var tmp_kol = 'yes';
    		}
    		else if (self.modal_kol_isSelect == false) {
    			var tmp_kol = 'no';
    		}
    		return {
    			account: self.add_account_account,
    			name: self.add_account_name,
    			belongs: id_fields.join('.'),
    			kol: tmp_kol,
                level: self.level
    		}
    	}
    },
    watch: {
        level: function(){
            if (this.kol_isSelect) {
                return 1;
            }
            else {
                return 6;
            }
        }
    },
    methods: {
        kolChange: function(_value){
            console.log(_value);
            if (_value) {
                this.level = 1;
            }
            else{
                this.level = 6;
            }
        },
        levelChange: function(_value){
            console.log(_value);
            if (_value == '1') {
                this.modal_kol_isSelect = true;
            }
            else{
                this.modal_kol_isSelect = false;
            }
        },
        filter: function(){
            console.log('account filter');
        },
        filterLevel: function(value, row){
            console.log('filterLevel', value, row);
            return value == row.level;
        },
        modalWemediasChange: function(_item){
            console.log('modalWemediasChange', _item);
        },
        switchDropdown: function(){
            this.dropdown_show = !this.dropdown_show;
        },
        selectDropdownItem: function(_item){
            _item.isSelected = !_item.isSelected;
        },
    	selectKol: function(){
            const self = this;
    		this.kol_isSelect = !this.kol_isSelect;
    		if (this.kol_isSelect) {
                var arr = [];
                for (var i = 0; i < self.tableData.length; i++) {
                    if (self.tableData[i].kol == 'yes') {
                        arr.push(self.tableData[i]);
                    }
                }
                self.tableData = arr;
            }
            else{
                self.tableData = self.tmpTableData;
            }
    	},
        getData: function(_cur_page) {
            const self = this;
            let pagesize = 20; //每次加载的数量
            if (!_cur_page || _cur_page == 1) {//第一页进来，清空原来的数据
            	self.tableData = [];
            	self.cur_page = 1;
            }
            let index =  pagesize * (self.cur_page - 1);
            let url = HOST + '/admin/wechataccounts/cursor/' + index + '/limit/' + pagesize;
            $.ajax({
                url: url,
                type: 'GET',
                statusCode: {
                    200: function(data) {
                        console.log('wechataccounts get data', data);
                    	if (data.accounts.length < pagesize) {
                            self.isReachEnd = true;
                        }
                        else{
                            self.isReachEnd = false;
                        }
                        self.tableData = self.tableData.concat(data.accounts);
                        self.tmpTableData = self.tableData;
                        self.$nextTick(function() {
                            console.log('v-for渲染已经完成');
                            $('.stage').bind('scroll', function() {
                                if (!self.isReachEnd && self.isScrollToBottom()) {
                                    self.cur_page++;
                                    self.getData(self.cur_page);
                                }
                            });
                        });
                    },
                    400: function() {
                        alert('参数错误');
                    }
                }
            });
        },
        isScrollToBottom: function() {
            var scrollTop = $('.stage').scrollTop(); //Y轴上溢出（滚动）的距离
            var viewHeight = $(document).height() - 56; //可视区域的高度
            var allHeight = $('#page-wechataccounts')[0].clientHeight; //可视区域的高度加上溢出（滚动）的距离
            if (scrollTop + viewHeight == allHeight) { //到底
                $('.stage')[0].scrollTop -= 80; //滚动条回弹
                return true;　　
            } else {
                return false;
            }
        },
        handleEdit: function(index, row) {
            console.log('handleEdit', index, row);
            goto('2-1-1', row);
        },
        handleDelete: function(index, row) {
            const self = this;
            self.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                let accountid = row.id;
                let url = HOST + '/admin/wechataccounts/' + accountid;
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    success: function(data, textStatus) {
                        console.log(' del data', textStatus);
                        self.$message.error('删除成功');
                        self.tableData.splice(index, 1);
                    },
                    error: function(jqXHR, textStatus) {
                        self.$message.error('删除失败');
                    }
                });
            }).catch(function(){});
        },
        handleSelectionChange: function(val) {
            console.log('handleSelectionChange', val);
            this.multipleSelection = val;
        },
        delAll: function() {
            const self = this;
            if (self.multipleSelection.length == 0) {
            	self.$message.info('请勾选所需要删除的项');
            	return false;
            }

            self.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                var tmp_multipleSelection = self.multipleSelection;//解决网络差的时候无法删除后面几项
                for (var i = 0, len = tmp_multipleSelection.length; i < len; i++) {
                    console.log('wangkj--len='+len+'--tmp_multipleSelection['+i+']=', tmp_multipleSelection[i]);
                    let accountid = tmp_multipleSelection[i].id;
                    let url = HOST + '/admin/wechataccounts/' + accountid;
                    $.ajax({
                        // async: false, //同步
                        type: 'DELETE',
                        url: url,
                        success: function(data, textStatus) {
                            console.log(' del data', textStatus);
                            self.$message.error('删除成功');
                            // self.cur_page = 1;
                            self.getData(1);
                            // let arrRes = $.grep(self.tableData, function(_n, _i) {
                            //     return _n == self.multipleSelection[i];
                            // }, true);
                            // console.log('arrRes', arrRes);
                            // // self.tableData = arrRes;
                        },
                        error: function(jqXHR, textStatus) {
                            self.$message.error('删除失败');
                        }
                    });
                }
            }).catch(function(){});
        },
        showModal: function() {
            this.createAccountBoxIsShow = !this.createAccountBoxIsShow;
            this.getAllFields();
            this.getAllSubfields();
        },
        hideModal: function() {
            this.createAccountBoxIsShow = !this.createAccountBoxIsShow;
            this.add_account_account = '';
            this.add_account_name = '';
            this.modalSelectedField = null;
            this.modalSelectedSubfields = [];
            this.level = 6;
        },
        getAllFields: function() {
            const self = this;
            let url = HOST + '/admin/fields';
            $.ajax({
                type: 'GET',
                url: url,
                success: function(data, textStatus) {
                    console.log('getFields get data', textStatus);
                    console.log(data);
                    self.modalSelectableFields = data.fields;
                },
                error: function(jqXHR, textStatus) {
                    self.$message.error('数据获取失败');
                }
            });
        },
        getAllSubfields: function() {
            const self = this;
            let url = HOST + '/admin/subfields';
            $.ajax({
                url: url,
                type: 'GET',
                data: {},
                success: function(data) {
                    self.modalSelectableSubfields = data.subfields;
                },
                error: function(jqXHR, textStatus) {
                    self.$message.error('数据获取失败');
                }
            });
        },
        changeSelectedField: function(_item){
            // console.log('changeSelectedField modalField_val=', this.modalField_val);
        	console.log('_item', _item);
        	const self = this;
        	if (!_item) {
        		self.getAllSubfields();
        		return false;
        	}
        	let field_id = _item;
        	let url = HOST+'/admin/fields/'+field_id;
        	$.ajax({
        		type: 'GET',
        		url: url,
        		success: function (data, textStatus) {
        			self.modalSelectableSubfields = data.subfields;
        		},
        		error: function (jqXHR, textStatus) {
        			alert(textStatus);
        		}
        	});
        },
        modalSelectSubfield: function(_item) {
            console.log('modalAddSubfield', _item);
            const self = this;
            if ( $.inArray(_item, self.modalSelectedSubfields) == -1 ) {
            	self.modalSelectedSubfields.push(_item);
            }
        },
        modalDelSelectedSubfield: function(_item){
        	console.log('modal remove', _item);
        	const self = this;
        	self.modalSelectedSubfields = $.grep(self.modalSelectedSubfields, function (_n, _i) {
        		return _n == _item;
        	}, true);
        },
        isNull: function( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        addAccount: function() {
            const self = this;
            if (self.isNull(self.add_account_name)) {
            	self.$message.error('名称不能为空');
            	return false;
            }
            if (self.isNull(self.add_account_account)) {
                self.$message.error('微信号不能为空');
                return false;
            }
            if (self.modalSelectedWemedias.length>0) {
                for (var i = 0; i < self.modalSelectedWemedias.length; i++) {
                    var item = self.modalSelectedWemedias[i];
                    if (item.name == '') {
                        self.$message.error('垂直平台名称不能为空');
                        return false;
                    }
                    else if (item.link == '') {
                        self.$message.error('垂直平台地址不能为空');
                        return false;
                    }
                }
            }
            let url = HOST + '/admin/wechataccounts';
            $.ajax({
                type: 'POST',
                url: url,
                data: self.formData,
                success: function(data, textStatus) {
                    self.$message.success('添加成功');
                    self.hideModal();
                    console.log('data', data);
                    console.log('modalSelectedWemedias', self.modalSelectedWemedias);
                    let accountid = data.id;
                    let url = HOST+'/admin/wechataccounts/'+accountid+'/wemedia';
                    for (var i = 0; i < self.modalSelectedWemedias.length; i++) {
                        let tmpData = self.modalSelectedWemedias[i];
                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: {
                                platform: tmpData.platform,
                                name: tmpData.name,
                                link: tmpData.link
                            },
                            success: function (data, textStatus) {
                                self.$message.success('添加'+tmpData.platform+'成功');
                                self.getData(1);
                            },
                            error: function (jqXHR, textStatus) {
                                self.$message.success('添加'+tmpData.platform+'失败');
                            }
                        });
                    }
                    self.getData(1);
                },
                error: function(jqXHR, textStatus) {
                    self.$message.error('添加失败');
                }
            });
        },
    }
});


// wechataccountdetail
var component_wechataccountdetail = new Vue({
    el: '#page-wechataccount-detail',
    data: {
        detailData: [],
        item: null,
        name: '',
        account: '',
        kol_isSelect: false,
        belongs: [],
        level: 6,
        hadWemediasStr: [],
        hadWemedias: [],
        selectableWemedias: [{
            label: '知乎',
            platform: 'zhihu',
            name: '',
            link: ''
        },{
            label: '豆瓣',
            platform: 'douban',
            name: '',
            link: ''
        },{
            label: '搜狐新闻',
            platform: 'sohu',
            name: '',
            link: ''
        },{
            label: '天天快报',
            platform: 'qq',
            name: '',
            link: ''
        },{
            label: '新浪新闻',
            platform: 'weibo',
            name: '',
            link: ''
        },{
            label: '一点资讯',
            platform: 'yidian',
            name: '',
            link: ''
        },{
            label: '今日头条',
            platform: 'toutiao',
            name: '',
            link: ''
        },{
            label: '凤凰新闻',
            platform: 'fenghaung',
            name: '',
            link: ''
        }],
        selectedWemediasStr: [],
        selectedWemedias: [],

        modal_isShow: false,
        modalSelectableSubfields: [],
        modalSelectedSubfields: [],
    },
    computed: {
        formData: function(){
            let id_belongs = [];
            for (var i = 0; i < this.belongs.length; i++) {
                id_belongs.push(this.belongs[i].id);
            }
            if (this.kol_isSelect == true) {
                var tmp_kol = 'yes';
            }
            else if (this.kol_isSelect == false) {
                var tmp_kol = 'no';
            }
            return {
                name: this.name,
                belongs: id_belongs.join('.'),
                kol: tmp_kol,
                level: this.level
            };
        }
    },
    watch: {
        level: function(){
            if (this.kol_isSelect) {
                return 1;
            }
            else {
                return 6;
            }
        }
    },
    methods: {
        kolChange: function(_value){
            console.log(_value);
            if (_value) {
                this.level = 1;
            }
            else{
                this.level = 6;
            }
        },
        levelChange: function(_value){
            console.log(_value);
            if (_value == 1) {
                this.kol_isSelect = true;
            }
            else{
                this.kol_isSelect = false;
            }
        },
        detailWemediasChange: function(_value){
            const self = this;
            console.log('detail Wemedias Change', _value);
            var tmp_value = _value;
            if (_value.length > self.selectedWemedias.length) {//添加
                let url = HOST+'/admin/wechataccounts/'+self.item.id+'/wemedia';
                var platformname_en = '';
                switch (_value[_value.length-1]) {
                    case '今日头条':
                        platformname_en = 'toutiao';
                        break;
                    case '天天快报':
                        platformname_en = 'qq';
                        break;
                    case '新浪新闻':
                        platformname_en = 'weibo';
                        break;
                    case '搜狐新闻':
                        platformname_en = 'sohu';
                        break;
                    case '一点资讯':
                        platformname_en = 'yiqian';
                        break;
                    case '豆瓣':
                        platformname_en = 'douban';
                        break;
                    case '知乎':
                        platformname_en = 'zhihu';
                        break;
                    case '凤凰新闻':
                        platformname_en = 'fenghuang';
                        break;
                    default:
                        // statements_def
                        break;
                }
                var formData = {
                    platform: platformname_en,
                    name: '',
                    link: ''
                };
                console.log('detailWemediasChange formData=', formData);
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: formData,
                    success: function (data, textStatus) {
                        console.log('add wemedia', formData.platform);

                    },
                    error: function (jqXHR, textStatus) {
                        alert(textStatus);
                    }
                });
            }

            for (var i = 0; i < self.selectedWemedias.length; i++) {
                tmp_value = $.grep(tmp_value, function(_n){
                    return _n == self.selectedWemedias[i].label;
                }, true);
                console.log('tmp_value', tmp_value);
            }
            if (tmp_value.length>0 || tmp_value.length>=self.selectedWemedias.length) {
                for (var j = 0; j < tmp_value.length; j++) {
                    // 中文转英文
                    var platformname_en = '';
                    switch (tmp_value[j]) {
                        case '今日头条':
                            platformname_en = 'toutiao';
                            break;
                        case '天天快报':
                            platformname_en = 'qq';
                            break;
                        case '新浪新闻':
                            platformname_en = 'weibo';
                            break;
                        case '搜狐新闻':
                            platformname_en = 'sohu';
                            break;
                        case '一点资讯':
                            platformname_en = 'yiqian';
                            break;
                        case '豆瓣':
                            platformname_en = 'douban';
                            break;
                        case '知乎':
                            platformname_en = 'zhihu';
                            break;
                        case '凤凰新闻':
                            platformname_en = 'fenghuang';
                            break;
                        default:
                            break;
                    }
                    var item_wemedia = {
                        label: tmp_value[j],
                        platform: platformname_en,
                        name: '',
                        link: ''
                    };
                    self.selectedWemedias.push(item_wemedia);
                }
            }
        },
        removeWemedia: function(_item){
            console.log('detailremoveWemedia', _item.value);
            const self = this;
            var platformname_cn = _item.value;
            var platformname_en = '';
            switch (platformname_cn) {
                case '今日头条':
                    platformname_en = 'toutiao';
                    break;
                case '天天快报':
                    platformname_en = 'qq';
                    break;
                case '新浪新闻':
                    platformname_en = 'weibo';
                    break;
                case '搜狐新闻':
                    platformname_en = 'sohu';
                    break;
                case '一点资讯':
                    platformname_en = 'yiqian';
                    break;
                case '豆瓣':
                    platformname_en = 'douban';
                    break;
                case '知乎':
                    platformname_en = 'zhihu';
                    break;
                case '凤凰新闻':
                    platformname_en = 'fenghuang';
                    break;
                default:
                    break;
            }
            //self.selectedWemedias数组里的项platfrom为英文，需要上面这个中文转英文
            self.selectedWemedias = $.grep(self.selectedWemedias, function(_n){
                return _n.platform == platformname_en;
            }, true);

            let accountid = self.item.id;
            var platformname = _item.value;
            let url = HOST + '/admin/wechataccounts/'+accountid+'/wemedia/'+platformname;
            $.ajax({
                type: 'DELETE',
                url: url,
                success: function(data, textStatus) {
                    console.log(' del data', platformname);
                    // self.$message.error('删除第' + (index + 1) + '行');
                    // self.tableData.splice(index, 1);
                },
                error: function(jqXHR, textStatus) {
                    // alert(textStatus);
                }
            });
        },
    	switchDropdown: function(){
    		this.dropdown_show = !this.dropdown_show;
    	},
    	selectDropdownItem: function(_item){
    		_item.isSelected = !_item.isSelected;
    	},
        getData: function(_item) {
            console.log('wechataccount get data', _item);
            const self = this;
            self.item = _item;
            var accountid = _item.id;
            let url = HOST+'/admin/wechataccounts/'+accountid;
            $.ajax({
            	type: 'GET',
            	url: url,
            	success: function (data, textStatus) {
            		console.log('wechataccount detail get data', textStatus);
            		console.log(data);
            		self.detailData = data;
            		self.name = data.name;
            		self.account = data.account;
            		if (data.kol=='yes') {
                        self.kol_isSelect = true;
                    }
                    else{
                        self.kol_isSelect = false;
                    }
            		self.belongs = data.belongs;
                    let url2 = HOST+'/admin/wechataccounts/'+accountid+'/wemedia';
                    $.ajax({
                        type: 'GET',
                        url: url2,
                        success: function (data, textStatus) {
                            console.log('detail wemedia get data', data);
                            var arr1 = [];//原来有的
                            if (data.wemedias.length>0) {
                                for (var i = 0; i < data.wemedias.length; i++) {// 英文转中文
                                    var label = '';
                                    switch(data.wemedias[i].platform){
                                        case 'toutiao':
                                            label = '今日头条';
                                            break;
                                        case 'qq':
                                            label = '天天快报';
                                            break;
                                        case 'weibo':
                                            label = '新浪新闻';
                                            break;
                                        case 'sohu':
                                            label = '搜狐新闻';
                                            break;
                                        case 'yidian':
                                            label = '一点资讯';
                                            break;
                                        case 'douban':
                                            label = '豆瓣';
                                            break;
                                        case 'zhihu':
                                            label = '知乎';
                                            break;
                                        case 'fenghuang':
                                            label = '凤凰新闻';
                                            break;
                                        default:
                                            // label = '其他';
                                    }
                                    let item = data.wemedias[i];
                                    item.label = label;
                                    arr1.push(item);
                                }
                            }
                            self.hadWemedias = arr1;
                            self.selectedWemedias = arr1;
                            console.log('英文转中文后的hadWemedias', self.hadWemedias);



                            var arr2 = [];
                            if (self.hadWemedias.length > 0) {
                                for (var i = 0; i < self.hadWemedias.length; i++) {
                                    arr2.push(self.hadWemedias[i].label);
                                }
                            }
                            self.hadWemediasStr = arr2;
                            console.log('进来时 hadWemediasStr', self.hadWemediasStr);

                            var arr = [];
                            if (self.selectedWemedias.length > 0) {
                                for (var i = 0; i < self.selectedWemedias.length; i++) {
                                    arr.push(self.selectedWemedias[i].label);
                                }
                            }
                            self.selectedWemediasStr = arr;
                            console.log('进来时 selectedWemediasStr', self.selectedWemediasStr);
                        },
                        error: function (jqXHR, textStatus) {
                            alert(textStatus);
                        }
                    });
            	},
            	error: function (jqXHR, textStatus) {
            		self.$message.error('公众号数据获取失败');
            	}
            });
            // self.level = 5;
        },
        delSubfield: function(_item) {
            console.log('delSubfield', _item);
            console.log('delSubfield', this.belongs);
            console.log('delSubfield 1', this.belongs.indexOf(_item));
            this.belongs.splice(this.belongs.indexOf(_item), 1);
            console.log('delSubfield 2', this.belongs);
        },
        showModal: function() {
            this.modal_isShow = true;
            this.modalGetSelectableSubfields();
        },
        hideModal: function() {
            this.modal_isShow = false;
            this.modalSelectedSubfields = [];
        },
        modalGetSelectableSubfields: function(){
        	const self = this;
        	let url = HOST+'/admin/subfields';
        	$.ajax({
        		type: 'GET',
        		url: url,
        		success: function (data, textStatus) {
        			console.log('modalGetSelectableSubfields get data', data);
        			let allSubfields = data.subfields;
        			let ownedSubfields = self.belongs;
        			for (var i = 0; i < ownedSubfields.length; i++) {
        				allSubfields = $.grep(allSubfields, function(_n, _i){
        					return _n.id == ownedSubfields[i].id;
        				}, true);
                        console.log('modalGetSelectableSubfields allSubfields=', allSubfields);
        			}
        			self.modalSelectableSubfields = allSubfields;
        		},
        		error: function (jqXHR, textStatus) {
        			self.$message.error('可选二级分类数据获取失败');
        		}
        	});
        },
        modalSelectSubfield: function(_item){
        	console.log('modalSelectSubfield', _item);
        	const self = this;
        	if ( $.inArray(_item, self.modalSelectedSubfields) == -1 ) {
        		self.modalSelectedSubfields.push(_item);
        	}
        },
        modalRemoveSubfield: function(_item){
        	console.log('modalRemoveSubfield', _item);
        	const self = this;
        	self.modalSelectedSubfields = $.grep(self.modalSelectedSubfields, function (_n, _i) {
        		return _n == _item;
        	}, true);
        },
        
        modelAddSubfields: function(){
        	const self = this;
        	self.belongs = self.belongs.concat(self.modalSelectedSubfields);
        	console.log('belongs', self.belongs);
        	self.hideModal();
        },
        isNull: function( str ){
            if ( str == "" ) return true;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            return re.test(str);
        },
        update: function(){
        	const self = this;
            if (self.isNull(self.name)) {
                self.$message.error('公众号名不能为空');
                return false;
            }
            if (self.isNull(self.account)) {
                self.$message.error('微信号不能为空');
                return false;
            }
        	var accountid = self.detailData.id;
        	let url = HOST+'/admin/wechataccounts/'+accountid;
        	$.ajax({
        		type: 'PUT',
        		url: url,
        		data: self.formData,
        		success: function (data, textStatus) {
                    for (var i = 0; i < self.selectedWemedias.length; i++) {
                        var item = self.selectedWemedias[i];
                        var platformname = item.platform;
                        console.log('update platformname=', platformname);
                        let url = HOST+'/admin/wechataccounts/'+accountid+'/wemedia/'+platformname;
                        let formData = {
                            name: item.name,
                            link: item.link
                        };
                        console.log('update url=', url, 'formData=', formData);
                        $.ajax({
                            type: 'PUT',
                            url: url,
                            data: formData,
                            success: function (data, textStatus) {
                                self.$message.success('修改成功');
                            },
                            error: function (jqXHR, textStatus) {
                                self.$message.error('修改失败');
                            }
                        });
                    }
        			self.$message.success('保存成功');return;
                    self.getData(self.item);
        		},
        		error: function (jqXHR, textStatus) {
        			self.$message.error('保存失败');
        		}
        	});
        },
        cancelUpdate: function(){
            const self = this;
            self.$confirm('如您修改的内容未保存，是否直接返回?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                goto('2-1');
            }).catch(function(){});
        }
    }
});

var component_cluster = new Vue({
    el: '#page-clusters',
    data: {
        tableData: [],
        total: 0,
    },
    methods: {
        getData: function() {
            const self = this;
            let url = HOST + '/admin/clusters';
            $.ajax({
                url: url,
                type: 'GET',
                success: function(data){
                    console.log('get clusters success', data);
                    self.total = data.count;
                    self.tableData = data.clusters;
                },
                error: function(jqXHR){
                    self.$message.error('获取cluster列表失败');
                }
            });
        },
        enterDetail: function(row, event){
            console.log('enterDetail row=', row);
            goto('2-2-1', row);
        }
    }
});

var component_clusterdetail = new Vue({
    el: '#page-cluster-detail',
    data: {
        clusterid: '',
        tableData: [],
        total: 0,
        isReachEnd: false,
        cur_page: 1
    },
    methods: {
        getData: function(_item) {
            console.log('cluster detail item', _item);
            this.clusterid = _item.id;
            this.total = _item.count
            this.getDataByPage(1);
        },
        isScrollToBottom: function(){
            var scrollTop = $('.stage').scrollTop(); //Y轴上溢出（滚动）的距离
            var viewHeight = $(document).height() - 56; //可视区域的高度
            var allHeight = $('#page-cluster-detail')[0].clientHeight; //可视区域的高度加上溢出（滚动）的距离
            if (scrollTop + viewHeight == allHeight) { //到底
                $('.stage')[0].scrollTop -= 80; //滚动条回弹
                return true;　　
            } else {
                return false;
            }
        },
        getDataByPage: function(_cur_page){
            const self = this;
            if (!_cur_page || _cur_page == 1) {//第一页进来，清空原来的数据
                self.tableData = [];
                self.cur_page = 1;
            }
            var pagesize = 20;
            var num1 = pagesize * (self.cur_page - 1);
            let url = HOST + '/admin/clusters/'+self.clusterid+'/accounts/cursor/'+num1+'/limit/'+pagesize;
            $.ajax({
                type: 'GET',
                url: url,
                success: function(data, textStatus) {
                    console.log('cluster detail data', data);
                    if (data.accounts.length < pagesize) {
                        self.isReachEnd = true;
                    }
                    else{
                        self.isReachEnd = false;
                    }
                    self.tableData = self.tableData.concat(data.accounts);
                    self.$nextTick(function() {
                        console.log('v-for渲染已经完成');
                        $('.stage').bind('scroll', function() {
                            if (!self.isReachEnd && self.isScrollToBottom()) {
                                self.cur_page++;
                                self.getDataByPage(self.cur_page);
                            }
                        });
                    });
                },
                error: function(jqXHR, textStatus) {
                    self.$message.error('获取pack server数据失败');
                }
            });
        }

    }
});

var component_packserver = new Vue({
    el: '#page-packserver',
    data: {
        tableData: [],
        total: 0,
    },
    methods: {
        getData: function() {
            const self = this;
            let url = HOST + '/admin/server/packservers';
            $.ajax({
                type: 'GET',
                url: url,
                success: function(data, textStatus) {
                    console.log('packserver get data', data);
                    self.total = data.count;
                    self.tableData = data.packservers;
                },
                error: function(jqXHR, textStatus) {
                    self.$message.error('获取pack server数据失败');
                }
            });
        },
        enterDetail: function(row, event){
            console.log('enterDetail row=', row);
            goto('3-1-1');
        }
    }
});

var component_packserverdetail = new Vue({
    el: '#page-packserver-detail',
    data: {
        tableData: [],
    },
    methods: {
        getData: function(_item) {
            const self = this;
            var packserverid = _item.id;
            let url = HOST + '/admin/server/packservers'+packserverid+'/clusters';
            $.ajax({
                type: 'GET',
                url: url,
                success: function(data, textStatus) {
                    console.log('packserver detail get data', data);
                    self.tableData = data.clusters;
                },
                error: function(jqXHR, textStatus) {
                    self.$message.error('获取pack server下clusters数据失败');
                }
            });
        },
        enterDetail: function(row, event){
            console.log('enterDetail row=', row);
            goto('3-1-1');
        }
    }
});

var component_sysfix = new Vue({
    el: '#page-sysfix',
    data: {
        upload_file_name: '',
        upload_board_show: false
    },
    created: function(){
    },
    methods: {
        refactorClusters: function(){
            const self = this;
            self.$confirm('此操作将重新构建集合, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
            }).then(() => {
                self.$message({
                    type: 'success',
                    message: '成功!'
                });
                let url = HOST + '/admin/operate/rebuild/clusters';
                $.ajax({
                    type: 'POST',
                    url: url,
                    success: function(data, textStatus) {
                        self.$message.success('重新构建成功');
                    },
                    error: function(jqXHR, textStatus) {
                        self.$message.error('重新构建失败');
                    }
                });
            }).catch(() => {});
        },
        uploadChange: function(){
            var files = $('#fileUpload')[0].files;
            var file = files[0];
            var firstName = file.name.split('.')[0];
            console.log('uploadOnchange file', file, firstName, file.size);
            // if (firstName != 'new_accounts') {
            //     alert('上传的文件名必须为"new_accounts"，请重新选择文件');
            //     return false;
            // }
            if (file.size > (1024*1024*2.5)) {
                alert('上传的文件不能超过2.5M，请重新选择文件');
                return false;
            }
            this.upload_board_show = true;
            this.upload_file_name = file.name;
        },
        upload: function(event){
            event.preventDefault();
            const self = this;
            var formData = new FormData($('#upload_accounts')[0]);
            $.ajax({
                url: HOST+'/admin/operate/import/accounts',
                type: 'POST',
                data: formData,
                // async: false,
                cache: false,//兼容IE8
                enctype: 'multipart/form-data',
                contentType: false,//禁止jQuery的转换操作
                processData: false,
                success: function(data){
                    self.$message.success('上传成功');
                    console.log('upload success res', data);
                    //清空
                    self.upload_board_show = false;
                    self.upload_file_name = '';
                },
                error: function(res){
                    self.$message.error('上传失败');
                    console.log('upload error res', res);
                    //清空
                    self.upload_board_show = false;
                    self.upload_file_name = '';
                }
            });
        }
    }
});