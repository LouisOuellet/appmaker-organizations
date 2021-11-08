API.Plugins.organizations = {
	forms:{
		create:{
			0:"name",
			company_information:{
				0:"address",
				1:"city",
				2:"zipcode",
				3:"state",
				4:"country",
				5:"phone",
				6:"toll_free",
				7:"fax",
				8:"email",
				9:"website",
			},
		},
		update:{
			0:"name",
			1:"business_num",
			company_information:{
				0:"address",
				1:"city",
				2:"zipcode",
				3:"state",
				4:"country",
				5:"phone",
				6:"toll_free",
				7:"fax",
				8:"email",
				9:"website",
			},
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Organizations', 'main_navigation');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Organizations', icon: 'organizations'}, function(card){
				API.request('organizations','read',{
					data:{options:{ link_to:'OrganizationsIndex',plugin:'organizations',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(var [key, value] of Object.entries(dataset.output.dom)){ API.Helper.set(API.Contents,['data','dom','organizations',value.id],value); }
						for(var [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','organizations',value.id],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.dom, {
							headers:dataset.output.headers,
							id:'OrganizationsIndex',
							modal:true,
							key:'name',
							clickable:{ enable:true, view:'details'},
							set:{status:1,isActive:"true"},
							controls:{ toolbar:true},
							import:{ key:'name', },
							load:false,
						});
					}
				});
			});
		},
		details:function(){
			var container = $('div[data-plugin="organizations"][data-id]').last();
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id");
			API.request(url.searchParams.get("p"),'get',{data:{id:id,key:'name'}},function(result){
				var dataset = JSON.parse(result);
				if(dataset.success != undefined){
					container.attr('data-id',dataset.output.this.raw.id);
					container.find('span[data-plugin="organizations"][data-key="id"]').html(dataset.output.this.raw.id);
					// GUI
					// Adding Layout
					API.GUI.Layouts.details.build(dataset.output,container,{title:"Organization Details",image:"/dist/img/building.png"},function(data,layout){
						console.log(layout);
						if(container.parent('.modal-body').length > 0){
							var modal = container.parent('.modal-body').parent().parent().parent();
							modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').off().click(function(){
								API.CRUD.update.show({ container:container, keys:data.this.raw });
							});
						}
						if(data.this.dom.isActive || API.Auth.validate('custom', 'organizations_isActive', 1)){
							// History
							API.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-history",text:API.Contents.Language["History"]},function(data,layout,tab,content){
								API.Helper.set(API.Contents,['layouts','organizations',data.this.raw.id,layout.main.attr('id')],layout);
								content.addClass('p-3');
								content.append('<div class="timeline" data-plugin="organizations"></div>');
								layout.timeline = content.find('div.timeline');
								var today = new Date();
								API.Builder.Timeline.add.date(layout.timeline,today);
								layout.timeline.find('.time-label').first().html('<div class="btn-group"></div>');
								layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-primary" data-table="all">'+API.Contents.Language['All']+'</button>');
								var options = {plugin:"organizations"}
								// Debug
								if(API.debug){
									API.GUI.Layouts.details.button(data,layout,{icon:"fas fa-stethoscope"},function(data,layout,button){
										button.off().click(function(){
											console.log(data);
											console.log(layout);
										});
									});
								}
								// Clear
								if(API.Auth.validate('custom', 'organizations_clear', 1)){
									API.GUI.Layouts.details.control(data,layout,{color:"danger",icon:"fas fa-snowplow",text:API.Contents.Language["Clear"]},function(data,layout,button){
										button.off().click(function(){
											API.request('organizations','clear',{ data:data.this.raw },function(){
												API.Plugins.organizations.load.details();
											});
										});
									});
								}
								// Name
								options.field = "name";
								if(API.Helper.isSet(options,['td'])){ delete options.td; }
								API.GUI.Layouts.details.data(data,layout,options);
								// Business Number
								if(API.Auth.validate('custom', 'organizations_business_num', 1)){
									options.field = "business_num";
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								}
								// Code
								if(API.Auth.validate('custom', 'organizations_code', 1)){
									options.field = "code";
									options.td = '';
									options.td += '<td>';
										options.td += '<div class="row">';
											if(API.Auth.validate('custom', 'organizations_code_ccn', 1) && data.this.dom.setCodeCCN != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><b>'+API.Contents.Language.setCodeCCN+': </b></strong><span data-plugin="organizations" data-key="setCodeCCN">'+data.this.dom.setCodeCCN+'</span>';
												options.td += '</div>';
											}
											if(API.Auth.validate('custom', 'organizations_code_itmr4', 1) && data.this.dom.setCodeITMR4 != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><b>'+API.Contents.Language.setCodeITMR4+': </b></i></strong><span data-plugin="organizations" data-key="setCodeITMR4">'+data.this.dom.setCodeITMR4+'</span>';
												options.td += '</div>';
											}
											if(API.Auth.validate('custom', 'organizations_code_hvs', 1) && data.this.dom.setCodeHVS != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><b>'+API.Contents.Language.setCodeHVS+': </b></strong><span data-plugin="organizations" data-key="setCodeHVS">'+data.this.dom.setCodeHVS+'</span>';
												options.td += '</div>';
											}
										options.td += '</div>';
									options.td += '</td>';
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								}
								// Status
								if(API.Helper.isSet(API.Plugins,['statuses']) && API.Auth.validate('custom', 'organizations_status', 1)){
									if(!data.this.dom.isActive){
										layout.details.prepend('<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">Inactive</div></div>');
									}
									layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="statuses">'+API.Contents.Language['Status']+'</button>');
									options.field = "status";
									options.td = '';
									options.td += '<td data-plugin="organizations" data-key="'+options.field+'">';
										if(API.Helper.isSet(API.Contents.Statuses,['organizations',data.this.raw.status])){
											options.td += '<span class="badge bg-'+API.Contents.Statuses.organizations[data.this.raw.status].color+'">';
												options.td += '<i class="'+API.Contents.Statuses.organizations[data.this.raw.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Statuses.organizations[data.this.raw.status].name+'';
											options.td += '</span>';
										}
									options.td += '</td>';
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								}
								// Address
								options.field = "address";
								options.td = '<td data-plugin="organizations">';
									options.td += '<span data-plugin="organizations" data-key="address">'+data.this.dom.address+'</span>, ';
									options.td += '<span data-plugin="organizations" data-key="city">'+data.this.dom.city+'</span>, ';
									options.td += '<span data-plugin="organizations" data-key="zipcode">'+data.this.dom.zipcode+'</span>';
								options.td += '</td>';
								API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								// Phone
								if(API.Auth.validate('custom', 'organizations_phone', 1)){
									options.field = "phone";
									options.td = '';
									options.td += '<td>';
										options.td += '<div class="row">';
											if(data.this.dom.phone != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><i class="fas fa-phone mr-1"></i></strong><a href="tel:'+data.this.dom.phone+'" data-plugin="organizations" data-key="phone">'+data.this.dom.phone+'</a>';
												options.td += '</div>';
											}
											if(data.this.dom.toll_free != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><i class="fas fa-phone mr-1"></i></strong><a href="tel:'+data.this.dom.toll_free+'" data-plugin="organizations" data-key="toll_free">'+data.this.dom.toll_free+'</a>';
												options.td += '</div>';
											}
											if(data.this.dom.fax != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><i class="fas fa-fax mr-1"></i></strong><a href="tel:'+data.this.dom.fax+'" data-plugin="organizations" data-key="fax">'+data.this.dom.fax+'</a>';
												options.td += '</div>';
											}
										options.td += '</div>';
									options.td += '</td>';
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								}
								// Email
								options.field = "email";
								options.td = '<td><strong><i class="fas fa-envelope mr-1"></i></strong><a href="mailto:'+data.this.dom.email+'" data-plugin="organizations" data-key="'+options.field+'">'+data.this.dom.email+'</a></td>';
								API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								// Website
								options.field = "website";
								options.td = '<td><strong><i class="fas fa-globe mr-1"></i></strong><a href="'+data.this.dom.website+'" data-plugin="organizations" data-key="'+options.field+'">'+data.this.dom.website+'</a></td>';
								API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								// Subsidiaries
								if(API.Auth.validate('custom', 'organizations_organizations', 1)){
									layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="subsidiaries">'+API.Contents.Language['Subsidiaries']+'</button>');
									options.field = "subsidiaries";
									if(API.Helper.isSet(options,['td'])){ delete options.td; }
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="subsidiaries"]');
										if(API.Helper.isSet(data.details,['organizations'])){
											for(var [subKey, subDetails] of Object.entries(data.details.organizations.dom)){
												if(subDetails.isActive || API.Auth.validate('custom', 'organizations_isActive', 1)){
													td.append(API.Plugins.organizations.GUI.buttons.details(subDetails,{remove:API.Auth.validate('custom', 'organizations_organizations', 4)}));
												}
											}
										}
										if(API.Auth.validate('custom', 'organizations_organizations', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link"><i class="fas fa-link"></i></button>');
										}
										API.Plugins.organizations.Events.subsidiaries(data,layout);
									});
								}
								// Services
								if(API.Helper.isSet(API.Plugins,['services']) && API.Auth.validate('custom', 'organizations_services', 1)){
									layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="services">'+API.Contents.Language['Services']+'</button>');
									options.field = "services";
									if(API.Helper.isSet(options,['td'])){ delete options.td; }
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="services"]');
										if(API.Helper.isSet(data.details,['services'])){
											for(var [subKey, subDetails] of Object.entries(data.details.services.dom)){
												td.append(API.Plugins.organizations.GUI.buttons.details(subDetails,{remove:API.Auth.validate('custom', 'organizations_services', 4),icon:{details:"fas fa-hand-holding-usd"}}));
											}
										}
										if(API.Auth.validate('custom', 'organizations_services', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link"><i class="fas fa-link"></i></button>');
										}
										API.Plugins.organizations.Events.services(data,layout);
									});
								}
								// Issues
								if(API.Helper.isSet(API.Plugins,['issues']) && API.Auth.validate('custom', 'organizations_issues', 1)){
									layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="issues">'+API.Contents.Language['Issues']+'</button>');
									options.field = "issues";
									if(API.Helper.isSet(options,['td'])){ delete options.td; }
									var issues = {};
									for(var [rid, relations] of Object.entries(data.relationships)){
										for(var [uid, relation] of Object.entries(relations)){
											if(relation.relationship == 'issues'){ issues[relation.link_to] = relation.statuses; }
										}
									}
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="issues"]');
										if(API.Helper.isSet(data.details,['issues'])){
											for(var [subKey, subDetails] of Object.entries(data.relations.issues)){
												td.append(
													API.Plugins.organizations.GUI.buttons.details(subDetails,{
														remove:API.Auth.validate('custom', 'organizations_issues', 4),
														content:subDetails.id+' - '+subDetails.name+' - '+API.Contents.Language[API.Contents.Statuses.issues[subDetails.status].name],
														color:{
															details:API.Contents.Statuses.issues[subDetails.status].color
														},
														icon:{
															details:API.Contents.Statuses.issues[subDetails.status].icon
														},
													})
												);
											}
										}
										if(API.Auth.validate('custom', 'organizations_issues', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link"><i class="fas fa-link"></i></button>');
										}
										API.Plugins.organizations.Events.issues(data,layout);
									});
								}
								// Tags
								if(API.Helper.isSet(API.Plugins,['tags']) && API.Auth.validate('custom', 'organizations_tags', 1)){
									options.field = "tags";
									options.td = '<td data-plugin="organizations" data-key="'+options.field+'"></td>';
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="tags"]');
										if(data.this.dom.tags == null){ data.this.dom.tags = ''; }
										for(var [subKey, subDetails] of Object.entries(API.Helper.trim(data.this.dom.tags,';').split(';'))){
											if(subDetails != ''){
												td.append(
													API.Plugins.organizations.GUI.buttons.details({name:subDetails},{
														remove:API.Auth.validate('custom', 'organizations_tags', 4),
														id: "name",
														key: "name",
														icon:{
															details:"fas fa-tag",
															remove:"fas fa-backspace",
														},
														action:{
															remove:"untag",
														},
													})
												);
											}
										}
										if(API.Auth.validate('custom', 'organizations_tags', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="tag"><i class="fas fa-plus"></i></button>');
										}
										API.Plugins.organizations.Events.tags(data,layout);
									});
								}
								// Notes
								if(API.Helper.isSet(API.Plugins,['notes']) && API.Auth.validate('custom', 'organizations_notes', 1)){
									API.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-sticky-note",text:API.Contents.Language["Notes"]},function(data,layout,tab,content){
										layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="notes">'+API.Contents.Language['Notes']+'</button>');
										layout.content.notes = content;
										layout.tabs.notes = tab;
										if(API.Auth.validate('custom', 'organizations_notes', 2)){
											content.append('<div><textarea title="Note" name="note" class="form-control"></textarea></div>');
											content.find('textarea').summernote({
												toolbar: [
													['font', ['fontname', 'fontsize']],
													['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
													['color', ['color']],
													['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
												],
												height: 250,
											});
											var html = '';
											html += '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">';
												html += '<form class="form-inline my-2 my-lg-0 ml-auto">';
													if(API.Helper.isSet(API.Plugins,['statuses']) && API.Auth.validate('custom', 'organizations_status', 1)){
														html += '<select class="form-control mr-sm-2" name="status" style="width: 150px;">';
														for(var [order, status] of Object.entries(API.Contents.Statuses.organizations)){
															html += '<option value="'+order+'">'+API.Helper.ucfirst(status.name)+'</option>'
														}
														html += '</select>';
													}
													html += '<button class="btn btn-warning my-2 my-sm-0" type="button" data-action="reply"><i class="fas fa-sticky-note mr-1"></i>'+API.Contents.Language['Add Note']+'</button>';
												html += '</form>';
											html += '</nav>';
											content.append(html);
										}
									});
									API.Plugins.organizations.Events.notes(data,layout);
								}
								// Contacts
								if(API.Helper.isSet(API.Plugins,['contacts']) && API.Auth.validate('custom', 'organizations_contacts', 1)){
									API.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-address-book",text:API.Contents.Language["Contacts"]},function(data,layout,tab,content){
										layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="contacts">'+API.Contents.Language['Contacts']+'</button>');
										layout.content.contacts = content;
										layout.tabs.contacts = tab;
										content.addClass('p-3');
										var html = '';
										html += '<div class="row">';
											html += '<div class="col-md-12 mb-3">';
												html += '<div class="input-group">';
													html += '<input type="text" class="form-control">';
													html += '<div class="input-group-append pointer" data-action="clear">';
														html += '<span class="input-group-text"><i class="fas fa-times" aria-hidden="true"></i></span>';
													html += '</div>';
													html += '<div class="input-group-append">';
														html += '<span class="input-group-text"><i class="icon icon-search mr-1"></i>'+API.Contents.Language["Search"]+'</span>';
													html += '</div>';
												html += '</div>';
											html += '</div>';
										html += '</div>';
										html += '<div class="row"></div>';
										content.append(html);
										area = content.find('div.row').last();
										if(API.Auth.validate('custom', 'organizations_contacts', 2)){
											var html = '';
											html += '<div class="col-sm-12 col-md-6">';
												html += '<div class="card pointer addContact">';
													html += '<div class="card-body py-4">';
														html += '<div class="text-center p-5">';
															html += '<i class="fas fa-plus-circle fa-10x mt-3 mb-2"></i>';
														html += '</div>';
													html += '</div>';
												html += '</div>';
											html += '</div>';
											area.append(html);
										}
										if(API.Helper.isSet(data,['relations','contacts'])){
											for(var [id, relation] of Object.entries(data.relations.contacts)){
												if(relation.isActive||API.Auth.validate('custom', 'organizations_contacts_isActive', 1)){
													API.Plugins.organizations.GUI.contact(relation,layout);
												}
											}
										}
									});
									API.Plugins.organizations.Events.contacts(data,layout);
								}
								// Calls
								if(API.Helper.isSet(API.Plugins,['calls']) && API.Auth.validate('custom', 'organizations_calls', 1)){
									API.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-phone-square",text:API.Contents.Language["Calls"]},function(data,layout,tab,content){
										API.GUI.Layouts.details.control(data,layout,{color:"success",icon:"fas fa-phone",text:API.Contents.Language["Call"]},function(data,layout,button){
											button.off().click(function(){
												var now = new Date();
												var call = {
													date:now,
													time:now,
													status:3,
													assigned_to:API.Contents.Auth.User.id,
													relationship:'organizations',
													link_to:data.this.raw.id,
												};
												API.request('calls','create',{data:call},function(result){
													var record = JSON.parse(result);
													if(typeof record.success !== 'undefined'){
														API.Helper.set(data,['details','calls','dom',record.output.dom.id],record.output.dom);
														API.Helper.set(data,['details','calls','raw',record.output.raw.id],record.output.raw);
														API.Helper.set(data,['relations','calls',record.output.dom.id],record.output.dom);
														API.Plugins.calls.Events.create(data,record.output.raw);
													}
												});
											});
										});
										layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="calls">'+API.Contents.Language['Calls']+'</button>');
										layout.content.calls = content;
										layout.tabs.calls = tab;
										var html = '';
										html += '<div class="row p-3">';
											html += '<div class="col-md-12">';
												html += '<div class="input-group">';
													html += '<input type="text" class="form-control">';
													html += '<div class="input-group-append pointer" data-action="clear"><span class="input-group-text"><i class="fas fa-times"></i></span></div>';
													html += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+API.Contents.Language['Search']+'</span></div>';
												html += '</div>';
											html += '</div>';
										html += '</div>';
										html += '<div class="row px-2 py-0">';
											html += '<table class="table table-sm table-striped table-hover mb-0">';
					              html += '<thead>';
					                html += '<tr>';
					                  html += '<th data-header="schedule">'+API.Contents.Language['Schedule']+'</th>';
					                  html += '<th data-header="status">'+API.Contents.Language['Status']+'</th>';
														if(API.Auth.validate('custom', 'organizations_calls_phone', 1)){
					                  	html += '<th data-header="phone">'+API.Contents.Language['Phone']+'</th>';
														}
					                  html += '<th data-header="contact">'+API.Contents.Language['Contact']+'</th>';
					                  html += '<th data-header="assigned_to">'+API.Contents.Language['Assigned to']+'</th>';
														if((!API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']) && API.Contents.Settings.customization.showInlineCallsControls.value)||(API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']) && API.Contents.Auth.Options.application.showInlineCallsControls.value)){
					                  	html += '<th data-header="action">'+API.Contents.Language['Action']+'</th>';
														}
					                html += '</tr>';
					              html += '</thead>';
					              html += '<tbody></tbody>';
					            html += '</table>';
						        html += '</div>';
										content.append(html);
										if(API.Helper.isSet(data,['relations','calls'])){
											for(var [id, relation] of Object.entries(data.relations.calls)){
												if(relation.status > 2){ API.Plugins.organizations.GUI.call(data,layout,relation); }
											}
										}
										API.Plugins.organizations.Events.calls(data,layout);
									});
								}
								// Callbacks
								if(API.Helper.isSet(API.Plugins,['callbacks']) && API.Auth.validate('custom', 'organizations_callbacks', 1)){
									API.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-phone-square",text:API.Contents.Language["Callbacks"]},function(data,layout,tab,content){
										layout.content.callbacks = content;
										layout.tabs.callbacks = tab;
										var html = '';
										html += '<div class="row p-3">';
											html += '<div class="col-md-12">';
												html += '<div class="input-group">';
													html += '<div class="btn-group mr-3">';
														html += '<button data-action="create" class="btn btn-success"><i class="fas fa-plus-circle" aria-hidden="true"></i></button>';
													html += '</div>';
													html += '<input type="text" class="form-control">';
													html += '<div class="input-group-append pointer" data-action="clear"><span class="input-group-text"><i class="fas fa-times"></i></span></div>';
													html += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+API.Contents.Language['Search']+'</span></div>';
												html += '</div>';
											html += '</div>';
										html += '</div>';
										html += '<div class="row px-2 py-0">';
											html += '<table class="table table-sm table-striped table-hover mb-0">';
					              html += '<thead>';
					                html += '<tr>';
					                  html += '<th data-header="schedule">'+API.Contents.Language['Schedule']+'</th>';
					                  html += '<th data-header="status">'+API.Contents.Language['Status']+'</th>';
														if(API.Auth.validate('custom', 'organizations_calls_phone', 1)){
					                  	html += '<th data-header="phone">'+API.Contents.Language['Phone']+'</th>';
														}
					                  html += '<th data-header="contact">'+API.Contents.Language['Contact']+'</th>';
					                  html += '<th data-header="assigned_to">'+API.Contents.Language['Assigned to']+'</th>';
														if((!API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']) && API.Contents.Settings.customization.showInlineCallsControls.value)||(API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']) && API.Contents.Auth.Options.application.showInlineCallsControls.value)){
					                  	html += '<th data-header="action">'+API.Contents.Language['Action']+'</th>';
														}
					                html += '</tr>';
					              html += '</thead>';
					              html += '<tbody></tbody>';
					            html += '</table>';
						        html += '</div>';
										content.append(html);
										if(API.Helper.isSet(data,['relations','calls'])){
											for(var [id, relation] of Object.entries(data.relations.calls)){
												if(relation.status <= 2){ API.Plugins.organizations.GUI.call(data,layout,relation); }
											}
										}
										API.Plugins.organizations.Events.callbacks(data,layout);
									});
								}
								// Users
								if(API.Helper.isSet(API.Plugins,['users']) && API.Auth.validate('custom', 'organizations_users', 1)){
									layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="users">'+API.Contents.Language['Users']+'</button>');
									options.field = "assigned_to";
									options.td = '<td data-plugin="organizations" data-key="'+options.field+'"></td>';
									API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="assigned_to"]');
										if(API.Helper.isSet(data.details,['users'])){
											if(data.this.raw.assigned_to == null){ data.this.raw.assigned_to = ''; }
											for(var [subKey, subDetails] of Object.entries(API.Helper.trim(data.this.raw.assigned_to,';').split(';'))){
												if(subDetails != ''){
													var user = data.details.users.dom[subDetails];
													td.append(
														API.Plugins.organizations.GUI.buttons.details(user,{
															remove:API.Auth.validate('custom', 'organizations_users', 4),
															key: "username",
															icon:{
																details:"fas fa-user",
																remove:"fas fa-user-minus",
															},
															action:{
																remove:"unassign",
															},
														})
													);
												}
											}
										}
										if(API.Auth.validate('custom', 'organizations_users', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="assign"><i class="fas fa-user-plus"></i></button>');
										}
										API.Plugins.organizations.Events.users(data,layout);
									});
								}
								// Settings
								if(API.Auth.validate('custom', 'organizations_settings', 1)){
									API.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-cog",text:API.Contents.Language["Settings"]},function(data,layout,tab,content){
										layout.content.settings = content;
										layout.tabs.settings = tab;
										html = '';
										content.append(html);
										// API.Plugins.organizations.Events.settings(data,layout);
									});
								}
								// Created
								options.field = "created";
								options.td = '<td><time class="timeago" datetime="'+data.this.raw.created.replace(/ /g, "T")+'" title="'+data.this.raw.created+'">'+data.this.raw.created+'</time></td>';
								API.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){ tr.find('time').timeago(); });
								// Subscription
								var icon = "fas fa-bell";
								if(API.Helper.isSet(data,['relations','users',API.Contents.Auth.User.id])){ var icon = "fas fa-bell-slash"; }
								API.GUI.Layouts.details.button(data,layout,{icon:icon},function(data,layout,button){
									button.off().click(function(){
										if(button.find('i').hasClass( "fa-bell" )){
											button.find('i').removeClass("fa-bell").addClass("fa-bell-slash");
											API.request("organizations",'subscribe',{data:{id:data.this.raw.id}},function(answer){
												var subscription = JSON.parse(answer);
												if(subscription.success != undefined){
													var sub = {};
													for(var [key, value] of Object.entries(API.Contents.Auth.User)){ sub[key] = value; }
													sub.created = subscription.output.relationship.created;
													sub.name = '';
													if((sub.first_name != '')&&(sub.first_name != null)){ if(sub.name != ''){sub.name += ' ';} sub.name += sub.first_name; }
													if((sub.middle_name != '')&&(sub.middle_name != null)){ if(sub.name != ''){sub.name += ' ';} sub.name += sub.middle_name; }
													if((sub.last_name != '')&&(sub.last_name != null)){ if(sub.name != ''){sub.name += ' ';} sub.name += sub.last_name; }
													API.Builder.Timeline.add.subscription(layout.timeline,sub,'bell','lightblue',function(item){
														if((API.Auth.validate('plugin','users',1))&&(API.Auth.validate('view','details',1,'users'))){
															item.find('i').first().addClass('pointer');
															item.find('i').first().off().click(function(){
																API.CRUD.read.show({ key:'username',keys:data.relations.users[item.attr('data-id')], href:"?p=users&v=details&id="+data.relations.users[item.attr('data-id')].username, modal:true });
															});
														}
													});
												}
											});
										} else {
											button.find('i').removeClass("fa-bell-slash").addClass("fa-bell");
											API.request(url.searchParams.get("p"),'unsubscribe',{data:{id:dataset.output.this.raw.id}},function(answer){
												var subscription = JSON.parse(answer);
												if(subscription.success != undefined){
													layout.timeline.find('[data-type="bell"][data-id="'+API.Contents.Auth.User.id+'"]').remove();
												}
											});
										}
									});
								});
								// Timeline
								for(var [rid, relations] of Object.entries(data.relationships)){
									for(var [uid, relation] of Object.entries(relations)){
										if(API.Helper.isSet(API.Plugins,[relation.relationship]) && (API.Auth.validate('custom', 'organizations_'+relation.relationship, 1) || relation.owner == API.Contents.Auth.User.username) && API.Helper.isSet(data,['relations',relation.relationship,relation.link_to])){
											var details = {};
											for(var [key, value] of Object.entries(data.relations[relation.relationship][relation.link_to])){ details[key] = value; }
											if(typeof relation.statuses !== 'undefined'){ details.status = data.details.statuses.dom[relation.statuses].order; }
											details.created = relation.created;
											details.owner = relation.owner;
											if(!API.Helper.isSet(details,['isActive'])||(API.Helper.isSet(details,['isActive']) && details.isActive)||(API.Helper.isSet(details,['isActive']) && !details.isActive && (API.Auth.validate('custom', 'organizations_'+relation.relationship+'_isActive', 1)||API.Auth.validate('custom', relation.relationship+'_isActive', 1)))){
												switch(relation.relationship){
													case"statuses":
														API.Builder.Timeline.add.status(layout.timeline,details);
														break;
													case"organizations":
														API.Builder.Timeline.add.client(layout.timeline,details,'building','secondary',function(item){
															if((API.Auth.validate('plugin','organizations',1))&&(API.Auth.validate('view','details',1,'organizations'))){
																item.find('i').first().addClass('pointer');
																item.find('i').first().off().click(function(){
																	API.CRUD.read.show({ key:'name',keys:data.details.organizations.dom[item.attr('data-id')], href:"?p=organizations&v=details&id="+data.details.organizations.dom[item.attr('data-id')].name, modal:true });
																});
															}
														});
														break;
													case"services":
														API.Builder.Timeline.add.service(layout.timeline,details,'hand-holding-usd','success',function(item){
															if((API.Auth.validate('plugin','services',1))&&(API.Auth.validate('view','details',1,'services'))){
																item.find('i').first().addClass('pointer');
																item.find('i').first().off().click(function(){
																	API.CRUD.read.show({ key:'name',keys:data.details.services.dom[item.attr('data-id')], href:"?p=services&v=details&id="+data.details.services.dom[item.attr('data-id')].name, modal:true });
																});
															}
														});
														break;
													case"issues":
														API.Builder.Timeline.add.issue(layout.timeline,details,'gavel','indigo',function(item){
															if((API.Auth.validate('plugin','issues',1))&&(API.Auth.validate('view','details',1,'issues'))){
																item.find('i').first().addClass('pointer');
																item.find('i').first().off().click(function(){
																	API.CRUD.read.show({ key:'id',keys:data.details.issues.dom[item.attr('data-id')], href:"?p=issues&v=details&id="+data.details.issues.dom[item.attr('data-id')].id, modal:true });
																});
															}
														});
														break;
													case"notes":
														API.Builder.Timeline.add.card(layout.timeline,details,'sticky-note','warning',function(item){
															item.find('.timeline-footer').remove();
															if(API.Auth.validate('custom', 'organizations_notes', 4)){
																$('<a class="time bg-warning pointer"><i class="fas fa-trash-alt"></i></a>').insertAfter(item.find('span.time.bg-warning'));
																item.find('a.pointer').off().click(function(){
																	API.CRUD.delete.show({ keys:data.relations.notes[item.attr('data-id')],key:'id', modal:true, plugin:'notes' },function(note){
																		item.remove();
																	});
																});
															}
														});
														break;
													case"contacts":
														API.Builder.Timeline.add.contact(layout.timeline,details,'address-card','secondary',function(item){
															item.find('i').first().addClass('pointer');
															item.find('i').first().off().click(function(){
																value = item.attr('data-name').toLowerCase();
																layout.content.contacts.find('input').val(value);
																layout.tabs.contacts.find('a').tab('show');
																layout.content.contacts.find('[data-csv]').hide();
																layout.content.contacts.find('[data-csv*="'+value+'"]').each(function(){ $(this).show(); });
															});
														});
														break;
													case"calls":
														details.status = data.details.statuses.raw[relation.statuses].order;
														details.organization = data.details.calls.raw[details.id].organization;
														API.Builder.Timeline.add.call(layout.timeline,details,'phone-square','olive',function(item){
															item.find('i').first().addClass('pointer');
															item.find('i').first().off().click(function(){
																API.CRUD.read.show({ key:{id:item.attr('data-id')}, title:item.attr('data-phone'), href:"?p=calls&v=details&id="+item.attr('data-id'), modal:true });
															});
														});
														break;
													case"users":
														API.Builder.Timeline.add.subscription(layout.timeline,details,'bell','lightblue',function(item){
															if((API.Auth.validate('plugin','users',1))&&(API.Auth.validate('view','details',1,'users'))){
																item.find('i').first().addClass('pointer');
																item.find('i').first().off().click(function(){
																	API.CRUD.read.show({ key:'username',keys:data.details.users.dom[item.attr('data-id')], href:"?p=users&v=details&id="+data.details.users.dom[item.attr('data-id')].username, modal:true });
																});
															}
														});
														break;
												}
											}
										}
									}
								}
								layout.timeline.find('.time-label').first().find('div.btn-group button').off().click(function(){
									var filters = layout.timeline.find('.time-label').first().find('div.btn-group');
									var all = filters.find('button').first();
									if($(this).attr('data-table') != 'all'){
										if(all.hasClass("btn-primary")){ all.removeClass('btn-primary').addClass('btn-secondary'); }
										if($(this).hasClass("btn-secondary")){ $(this).removeClass('btn-secondary').addClass('btn-primary'); }
										else { $(this).removeClass('btn-primary').addClass('btn-secondary'); }
										layout.timeline.find('[data-type]').hide();
										layout.timeline.find('.time-label').first().find('div.btn-group button.btn-primary').each(function(){
											switch($(this).attr('data-table')){
												case"notes":var icon = 'sticky-note';break;
												case"comments":var icon = 'comment';break;
												case"statuses":var icon = 'info';break;
												case"users":var icon = 'bell';break;
												case"subsidiaries":var icon = 'building';break;
												case"employees":var icon = 'id-card';break;
												case"contacts":var icon = 'address-card';break;
												case"calls":var icon = 'phone-square';break;
												case"services":var icon = 'hand-holding-usd';break;
												case"issues":var icon = 'gavel';break;
											}
											if((icon != '')&&(typeof icon !== 'undefined')){ layout.timeline.find('[data-type="'+icon+'"]').show(); }
										});
									} else {
										filters.find('button').removeClass('btn-primary').addClass('btn-secondary');
										all.removeClass('btn-secondary').addClass('btn-primary');
										layout.timeline.find('[data-type]').show();
									}
								});
							});
						} else {
							var container = layout.details.parents().eq(2);
							container.load('./src/views/404.php');
						}
					});
				}
			});
		},
	},
	GUI:{
		contact:function(dataset,layout,plugin = 'contacts'){
			var area = layout.content[plugin].find('div.row').eq(1);
			area.prepend(API.Plugins.organizations.GUI.card(dataset));
			var card = area.find('div.col-sm-12.col-md-6').first();
			if(API.Auth.validate('custom', 'organizations_'+plugin+'_btn_details', 1)){
				card.find('div.btn-group').append(API.Plugins.organizations.GUI.button(dataset,{id:'id',color:'primary',icon:'fas fa-eye',action:'details',content:API.Contents.Language['Details']}));
			}
			if(API.Auth.validate('custom', 'organizations_'+plugin+'_btn_subscriptions', 1)){
				card.find('div.btn-group').append(API.Plugins.organizations.GUI.button(dataset,{id:'id',color:'lightblue',icon:'fas fa-list-alt',action:'subscriptions',content:API.Contents.Language['Subscriptions']}));
			}
			if(API.Auth.validate('custom', 'organizations_'+plugin+'_btn_call', 1)){
				card.find('div.btn-group').append(API.Plugins.organizations.GUI.button(dataset,{id:'id',color:'success',icon:'fas fa-phone',action:'call',content:API.Contents.Language['Call']}));
			}
			if(API.Auth.validate('custom', 'organizations_'+plugin+'_btn_share', 1)){
				card.find('div.btn-group').append(API.Plugins.organizations.GUI.button(dataset,{id:'id',color:'navy',icon:'fas fa-share-alt',action:'share',content:API.Contents.Language['Share']}));
			}
			if(plugin == "employees" || plugin == "contacts"){
				if(API.Auth.validate('custom', 'organizations_'+plugin+'_btn_edit', 1)){
					card.find('div.btn-group').append(API.Plugins.organizations.GUI.button(dataset,{id:'id',color:'warning',icon:'fas fa-edit',action:'edit',content:API.Contents.Language['Edit']}));
				}
				if(API.Auth.validate('custom', 'organizations_'+plugin+'_btn_delete', 1)){
					card.find('div.btn-group').append(API.Plugins.organizations.GUI.button(dataset,{id:'id',color:'danger',icon:'fas fa-trash-alt',action:'delete',content:''}));
				}
			}
		},
		call:function(dataset,layout,call,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var csv = '';
			for(var [key, value] of Object.entries(call)){
				if(value == null){ value = '';call[key] = value; };
				if(jQuery.inArray(key,['date','time','status','phone','status','contact','assigned_to']) != -1){
					if(key == 'status'){ csv += API.Contents.Statuses.calls[call.status].name.replace(',','').toLowerCase()+','; } else {
						if(typeof value == 'string'){ csv += value.replace(',','').toLowerCase()+','; }
						else { csv += value+','; }
					}
				}
			}
			if(call.status > 2){ var body = layout.content.calls.find('tbody'); }
			else { var body = layout.content.callbacks.find('tbody'); }
			var html = '';
			html += '<tr data-csv="'+csv+'" data-id="'+call.id+'" data-phone="'+call.phone+'">';
				html += '<td class="pointer"><span class="badge bg-primary mx-1"><i class="fas fa-calendar-check mr-1"></i>'+call.date+API.Contents.Language[' at ']+call.time+'</span></td>';
				html += '<td class="pointer">';
					html += '<span class="mr-1 badge bg-'+API.Contents.Statuses.calls[call.status].color+'">';
						html += '<i class="'+API.Contents.Statuses.calls[call.status].icon+' mr-1"></i>'+API.Contents.Statuses.calls[call.status].name;
					html += '</span>';
				html += '</td>';
				if(API.Auth.validate('custom', 'organizations_calls_phone', 1)){
					html += '<td class="pointer"><span class="badge bg-success mx-1"><i class="fas fa-phone mr-1"></i>'+call.phone+'</span></td>';
				}
				if(call.contact != ''){
					html += '<td class="pointer"><span class="badge bg-secondary mx-1"><i class="fas fa-address-card mr-1"></i>'+call.contact+'</span></td>';
				} else {
					html += '<td class="pointer"></td>';
				}
				html += '<td class="pointer"><span class="badge bg-primary mx-1"><i class="fas fa-user mr-1"></i>'+call.assigned_to+'</span></td>';
				if((!API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']) && API.Contents.Settings.customization.showInlineCallsControls.value)||(API.Helper.isSet(API.Contents.Auth.Options,['application','showInlineCallsControls','value']) && API.Contents.Auth.Options.application.showInlineCallsControls.value)){
					html += '<td>';
						if(call.status <= 2){
							html += '<div class="btn-group btn-block m-0">';
								html += '<button class="btn btn-xs btn-success" data-action="start"><i class="fas fa-phone mr-1"></i>'+API.Contents.Language['Start']+'</button>';
								html += '<button class="btn btn-xs btn-danger" data-action="cancel"><i class="fas fa-phone-slash mr-1"></i>'+API.Contents.Language['Cancel']+'</button>';
								html += '<button class="btn btn-xs btn-primary" data-action="reschedule"><i class="fas fa-calendar-day mr-1"></i>'+API.Contents.Language['Re-Schedule']+'</button>';
							html += '</div>';
						} else if(call.status <= 3){
							html += '<div class="btn-group btn-block m-0">';
								html += '<button class="btn btn-xs btn-danger" data-action="end"><i class="fas fa-phone-slash mr-1"></i>'+API.Contents.Language['End']+'</button>';
							html += '</div>';
						}
					html += '</td>';
				}
			html += '</tr>';
			body.append(html);
			var tr = body.find('tr').last();
			if(callback != null){ callback(dataset,layout,call,tr); }
		},
		button:function(dataset,options = {}){
			var defaults = {
				icon:"fas fa-building",
				action:"details",
				color:"primary",
				key:"name",
				id:"id",
				content:"",
			};
			if(API.Helper.isSet(options,['icon'])){ defaults.icon = options.icon; }
			if(API.Helper.isSet(options,['action'])){ defaults.action = options.action; }
			if(API.Helper.isSet(options,['color'])){ defaults.color = options.color; }
			if(API.Helper.isSet(options,['key'])){ defaults.key = options.key; }
			if(API.Helper.isSet(options,['id'])){ defaults.id = options.id; }
			if(API.Helper.isSet(options,['content'])){ defaults.content = options.content; }
			else { defaults.content = dataset[defaults.key]; }
			if(defaults.content != ''){ defaults.icon += ' mr-1'; }
			return '<button type="button" class="btn btn-sm bg-'+defaults.color+'" data-id="'+dataset[defaults.id]+'" data-action="'+defaults.action+'"><i class="'+defaults.icon+'"></i>'+defaults.content+'</button>';
		},
		buttons:{
			details:function(dataset,options = {}){
				var defaults = {
					icon:{details:"fas fa-building",remove:"fas fa-unlink"},
					action:{details:"details",remove:"unlink"},
					color:{details:"primary",remove:"danger"},
					key:"name",
					id:"id",
					content:"",
					remove:false,
				};
				if(API.Helper.isSet(options,['icon','details'])){ defaults.icon.details = options.icon.details; }
				if(API.Helper.isSet(options,['icon','remove'])){ defaults.icon.remove = options.icon.remove; }
				if(API.Helper.isSet(options,['color','details'])){ defaults.color.details = options.color.details; }
				if(API.Helper.isSet(options,['color','remove'])){ defaults.color.remove = options.color.remove; }
				if(API.Helper.isSet(options,['action','details'])){ defaults.action.details = options.action.details; }
				if(API.Helper.isSet(options,['action','remove'])){ defaults.action.remove = options.action.remove; }
				if(API.Helper.isSet(options,['key'])){ defaults.key = options.key; }
				if(API.Helper.isSet(options,['id'])){ defaults.id = options.id; }
				if(API.Helper.isSet(options,['remove'])){ defaults.remove = options.remove; }
				if(API.Helper.isSet(options,['content'])){ defaults.content = options.content; }
				else { defaults.content = dataset[defaults.key]; }
				var html = '';
				html += '<div class="btn-group m-1" data-id="'+dataset[defaults.id]+'">';
					html += '<button type="button" class="btn btn-xs bg-'+defaults.color.details+'" data-id="'+dataset[defaults.id]+'" data-action="'+defaults.action.details+'"><i class="'+defaults.icon.details+' mr-1"></i>'+defaults.content+'</button>';
					if(defaults.remove){
						html += '<button type="button" class="btn btn-xs bg-'+defaults.color.remove+'" data-id="'+dataset[[defaults.id]]+'" data-action="'+defaults.action.remove+'"><i class="'+defaults.icon.remove+'"></i></button>';
					}
				html += '</div>';
				return html;
			},
		},
		card:function(dataset,options = {}){
			var csv = '';
			for(var [key, value] of Object.entries(dataset)){
				if(value == null){ value = '';dataset[key] = value; };
				if(jQuery.inArray(key,['first_name','middle_name','last_name','name','email','phone','mobile','office_num','other_num','about','job_title']) != -1){
					if(typeof value == 'string'){ csv += value.replace(',','').toLowerCase()+','; }
					else { csv += value+','; }
				}
			}
			var html = '';
			html += '<div class="col-sm-12 col-md-6 contactCard" data-csv="'+csv+'" data-id="'+dataset.id+'">';
			  html += '<div class="card">';
					if(!dataset.isActive){ html += '<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">'+API.Contents.Language['Inactive']+'</div></div>'; }
			    html += '<div class="card-header border-bottom-0">';
			      html += '<b class="mr-1">Title:</b>'+dataset.job_title;
			    html += '</div>';
			    html += '<div class="card-body pt-0">';
			      html += '<div class="row">';
			        html += '<div class="col-7">';
			          html += '<h2 class="lead"><b>'+dataset.name+'</b></h2>';
			          html += '<p class="text-sm"><b>About: </b> '+dataset.about+' </p>';
			          html += '<ul class="ml-4 mb-0 fa-ul">';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span><b class="mr-1">Email:</b><a href="mailto:'+dataset.email+'">'+dataset.email+'</a></li>';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Phone #:</b><a href="tel:'+dataset.phone+'">'+dataset.phone+'</a></li>';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Office #:</b><a href="tel:'+dataset.office_num+'">'+dataset.office_num+'</a></li>';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-mobile"></i></span><b class="mr-1">Mobile #:</b><a href="tel:'+dataset.mobile+'">'+dataset.mobile+'</a></li>';
			            html += '<li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span><b class="mr-1">Other #:</b><a href="tel:'+dataset.other_num+'">'+dataset.other_num+'</a></li>';
			          html += '</ul>';
			        html += '</div>';
			        html += '<div class="col-5 text-center">';
			          html += '<img src="/dist/img/default.png" alt="user-avatar" class="img-circle img-fluid">';
			        html += '</div>';
			      html += '</div>';
			    html += '</div>';
			    html += '<div class="card-footer">';
			      html += '<div class="text-right">';
			        html += '<div class="btn-group"></div>';
			      html += '</div>';
			    html += '</div>';
			  html += '</div>';
			html += '</div>';
			return html;
		},
	},
	Events:{
		subsidiaries:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="subsidiaries"]');
			td.find('button').off().click(function(){
				var button = $(this);
				if(button.attr('data-action') != "link"){ var organization = {raw:dataset.details.organizations.raw[button.attr('data-id')],dom:dataset.details.organizations.dom[button.attr('data-id')]}; }
				switch(button.attr('data-action')){
					case"details":
						API.CRUD.read.show({ key:'name',keys:organization.dom, href:"?p=organizations&v=details&id="+organization.raw.name, modal:true });
						break;
					case"unlink":
						API.request('organizations','unlink',{data:{id:dataset.this.raw.id,relationship:{relationship:'organizations',link_to:organization.raw.id}}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								layout.timeline.find('[data-type="building"][data-id="'+sub_dataset.output.id+'"]').remove();
								td.find('.btn-group[data-id="'+sub_dataset.output.id+'"]').remove();
							}
						});
						break;
					case"link":
						API.Builder.modal($('body'), {
							title:'Link a subsidiary',
							icon:'subsidiaries',
							zindex:'top',
							css:{ header: "bg-gray", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							API.Builder.input(body, 'organization', null,{plugin:'organizations'}, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>'+API.Contents.Language['Link']+'</button>');
							footer.find('button[data-action="link"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									API.request('organizations','link',{data:{id:dataset.this.dom.id,relationship:{relationship:'organizations',link_to:body.find('select').select2('val')}}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											API.Helper.set(API.Contents,['data','dom','organizations',sub_dataset.output.dom.id],sub_dataset.output.dom);
											API.Helper.set(API.Contents,['data','raw','organizations',sub_dataset.output.raw.id],sub_dataset.output.raw);
											API.Helper.set(dataset.details,['organizations','dom',sub_dataset.output.dom.id],sub_dataset.output.dom);
											API.Helper.set(dataset.details,['organizations','raw',sub_dataset.output.raw.id],sub_dataset.output.raw);
											API.Helper.set(dataset,['relations','organizations',sub_dataset.output.dom.id],sub_dataset.output.dom);
											var html = API.Plugins.organizations.GUI.buttons.details(sub_dataset.output.dom,{remove:API.Auth.validate('custom', 'organizations_organizations', 4)});
											if(td.find('button[data-action="link"]').length > 0){
												td.find('button[data-action="link"]').before(html);
											} else { td.append(html); }
											sub_dataset.output.dom.owner = sub_dataset.output.timeline.owner;
											sub_dataset.output.dom.created = sub_dataset.output.timeline.created;
											API.Builder.Timeline.add.client(layout.timeline,sub_dataset.output.dom,'building','secondary',function(item){
												if((API.Auth.validate('plugin','organizations',1))&&(API.Auth.validate('view','details',1,'organizations'))){
													item.find('i').first().addClass('pointer');
													item.find('i').first().off().click(function(){
														API.CRUD.read.show({ key:'name',keys:sub_dataset.output.dom, href:"?p=organizations&v=details&id="+sub_dataset.output.dom.name, modal:true });
													});
												}
											});
											API.Plugins.organizations.Events.subsidiaries(dataset,layout);
										}
									});
									modal.modal('hide');
								} else {
									body.find('.input-group').addClass('is-invalid');
									alert('No organization were selected!');
								}
							});
							modal.modal('show');
						});
						break;
				}
			});
			if(callback != null){ callback(dataset,layout); }
		},
		services:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="services"]');
			td.find('button').off().click(function(){
				var button = $(this);
				if(button.attr('data-action') != "link"){ var service = {raw:dataset.details.services.raw[button.attr('data-id')],dom:dataset.details.services.dom[button.attr('data-id')]}; }
				switch(button.attr('data-action')){
					case"details":
						API.CRUD.read.show({ key:'name',keys:service.dom, href:"?p=services&v=details&id="+service.raw.name, modal:true });
						break;
					case"unlink":
						API.request('organizations','unlink',{data:{id:dataset.this.raw.id,relationship:{relationship:'services',link_to:service.raw.id}}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								layout.timeline.find('[data-type="hand-holding-usd"][data-id="'+sub_dataset.output.id+'"]').remove();
								td.find('.btn-group[data-id="'+sub_dataset.output.id+'"]').remove();
							}
						});
						break;
					case"link":
						API.Builder.modal($('body'), {
							title:'Link a service',
							icon:'services',
							zindex:'top',
							css:{ header: "bg-gray", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							API.Builder.input(body, 'service', null,{plugin:'services'}, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>'+API.Contents.Language['Link']+'</button>');
							footer.find('button[data-action="link"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									API.request('organizations','link',{data:{id:dataset.this.dom.id,relationship:{relationship:'services',link_to:body.find('select').select2('val')}}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											API.Helper.set(API.Contents,['data','dom','services',sub_dataset.output.dom.id],sub_dataset.output.dom);
											API.Helper.set(API.Contents,['data','raw','services',sub_dataset.output.raw.id],sub_dataset.output.raw);
											API.Helper.set(dataset.details,['services','dom',sub_dataset.output.dom.id],sub_dataset.output.dom);
											API.Helper.set(dataset.details,['services','raw',sub_dataset.output.raw.id],sub_dataset.output.raw);
											API.Helper.set(dataset,['relations','services',sub_dataset.output.dom.id],sub_dataset.output.dom);
											var html = API.Plugins.organizations.GUI.buttons.details(sub_dataset.output.dom,{remove:API.Auth.validate('custom', 'organizations_services', 4),icon:{details:"fas fa-hand-holding-usd"}});
											if(td.find('button[data-action="link"]').length > 0){
												td.find('button[data-action="link"]').before(html);
											} else { td.append(html); }
											sub_dataset.output.dom.owner = sub_dataset.output.timeline.owner;
											sub_dataset.output.dom.created = sub_dataset.output.timeline.created;
											API.Builder.Timeline.add.service(layout.timeline,sub_dataset.output.dom,'hand-holding-usd','success',function(item){
												if((API.Auth.validate('plugin','services',1))&&(API.Auth.validate('view','details',1,'services'))){
													item.find('i').first().addClass('pointer');
													item.find('i').first().off().click(function(){
														API.CRUD.read.show({ key:'name',keys:sub_dataset.output.dom, href:"?p=services&v=details&id="+sub_dataset.output.dom.name, modal:true });
													});
												}
											});
											API.Plugins.organizations.Events.services(dataset,layout);
										}
									});
									modal.modal('hide');
								} else {
									body.find('.input-group').addClass('is-invalid');
									alert('No organization were selected!');
								}
							});
							modal.modal('show');
						});
						break;
				}
			});
			if(callback != null){ callback(dataset,layout); }
		},
		issues:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="issues"]');
			var issues = {};
			for(var [rid, relations] of Object.entries(dataset.relationships)){
				for(var [uid, relation] of Object.entries(relations)){
					if(relation.relationship == 'issues'){ issues[relation.link_to] = relation.statuses; }
				}
			}
			td.find('button').off().click(function(){
				var button = $(this);
				if(button.attr('data-action') != "link"){ var issue = {raw:dataset.details.issues.raw[button.attr('data-id')],dom:dataset.details.issues.dom[button.attr('data-id')]}; }
				switch(button.attr('data-action')){
					case"details":
						API.CRUD.read.show({ key:'name',keys:issue.dom, href:"?p=issues&v=details&id="+issue.raw.id, modal:true });
						break;
					case"unlink":
						API.request('organizations','unlink',{data:{id:dataset.this.raw.id,relationship:{relationship:'issues',link_to:issue.raw.id}}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								layout.timeline.find('[data-type="gavel"][data-id="'+sub_dataset.output.id+'"]').remove();
								td.find('.btn-group[data-id="'+sub_dataset.output.id+'"]').remove();
							}
						});
						break;
					case"link":
						API.Builder.modal($('body'), {
							title:'Link an issue',
							icon:'issues',
							zindex:'top',
							css:{ header: "bg-gray", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							API.Builder.input(body, 'issue', null,{plugin:'issues'}, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>'+API.Contents.Language['Link']+'</button>');
							footer.find('button[data-action="link"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									API.request('organizations','link',{data:{id:dataset.this.dom.id,relationship:{relationship:'issues',link_to:body.find('select').select2('val')}}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											API.Helper.set(API.Contents,['data','dom','issues',sub_dataset.output.dom.id],sub_dataset.output.dom);
											API.Helper.set(API.Contents,['data','raw','issues',sub_dataset.output.raw.id],sub_dataset.output.raw);
											API.Helper.set(dataset.details,['issues','dom',sub_dataset.output.dom.id],sub_dataset.output.dom);
											API.Helper.set(dataset.details,['issues','raw',sub_dataset.output.raw.id],sub_dataset.output.raw);
											sub_dataset.output.dom.status = 1;
											API.Helper.set(dataset,['relations','issues',sub_dataset.output.dom.id],sub_dataset.output.dom);
											var html = API.Plugins.organizations.GUI.buttons.details(sub_dataset.output.dom,{
												remove:API.Auth.validate('custom', 'organizations_issues', 4),
												content:sub_dataset.output.dom.id+' - '+sub_dataset.output.dom.name+' - '+API.Contents.Statuses.issues['1'].name,
												color:{
													details:API.Contents.Statuses.issues['1'].color
												},
												icon:{
													details:API.Contents.Statuses.issues['1'].icon
												},
											});
											if(td.find('button[data-action="link"]').length > 0){
												td.find('button[data-action="link"]').before(html);
											} else { td.append(html); }
											sub_dataset.output.dom.owner = sub_dataset.output.timeline.owner;
											sub_dataset.output.dom.created = sub_dataset.output.timeline.created;
											sub_dataset.output.dom.statuses = sub_dataset.output.timeline.statuses;
											sub_dataset.output.dom.status = 1;
											API.Builder.Timeline.add.issue(layout.timeline,sub_dataset.output.dom,'gavel','indigo',function(item){
												if((API.Auth.validate('plugin','issues',1))&&(API.Auth.validate('view','details',1,'issues'))){
													item.find('i').first().addClass('pointer');
													item.find('i').first().off().click(function(){
														API.CRUD.read.show({ key:'name',keys:sub_dataset.output.dom, href:"?p=issues&v=details&id="+sub_dataset.output.dom.id, modal:true });
													});
												}
											});
											API.Plugins.organizations.Events.issues(dataset,layout);
										}
									});
									modal.modal('hide');
								} else {
									body.find('.input-group').addClass('is-invalid');
									alert('No organization were selected!');
								}
							});
							modal.modal('show');
						});
						break;
				}
			});
			if(callback != null){ callback(dataset,layout); }
		},
		tags:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="tags"]');
			td.find('button').off().click(function(){
				var button = $(this);
				switch(button.attr('data-action')){
					case"untag":
						API.request('organizations','untag',{data:{id:dataset.this.raw.id,tag:button.attr('data-id')}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){ td.find('.btn-group[data-id="'+sub_dataset.output.tag+'"]').remove(); }
						});
						break;
					case"tag":
						API.Builder.modal($('body'), {
							title:'Add a tag',
							icon:'tags',
							zindex:'top',
							css:{ header: "bg-gray", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							API.Builder.input(body, 'tag', null, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="tag"><i class="fas fa-tag mr-1"></i>'+API.Contents.Language['Tag']+'</button>');
							footer.find('button[data-action="tag"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									var tags = [];
									td.find('div.btn-group[data-id]').each(function(){ tags.push($(this).attr('data-id')); });
									for(var [key, tag] of Object.entries(body.find('select').select2('val'))){
										if(tag != '' && jQuery.inArray(tag, tags) === -1){ tags.push(tag); }
									}
									API.request('organizations','tag',{data:{id:dataset.this.dom.id,tags:tags}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											for(var [key, tag] of Object.entries(sub_dataset.output.tags)){
												if(tag != '' && td.find('div.btn-group[data-id="'+tag+'"]').length <= 0){
													var html = API.Plugins.organizations.GUI.buttons.details({name:tag},{
														remove:API.Auth.validate('custom', 'organizations_tags', 4),
													  id: "name",
													  key: "name",
													  icon:{
													    details:"fas fa-tag",
													    remove:"fas fa-backspace",
													  },
													  action:{
													    remove:"untag",
													  },
													});
													if(td.find('button[data-action="tag"]').length > 0){
														td.find('button[data-action="tag"]').before(html);
													} else { td.append(html); }
												}
											}
											API.Plugins.organizations.Events.tags(dataset,layout);
										}
									});
									modal.modal('hide');
								} else {
									body.find('.input-group').addClass('is-invalid');
									alert('No organization were selected!');
								}
							});
							modal.modal('show');
						});
						break;
				}
			});
			if(callback != null){ callback(dataset,layout); }
		},
		users:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="assigned_to"]');
			td.find('button').off().click(function(){
				var button = $(this);
				if(button.attr('data-action') != "assign"){
					if(API.Helper.isSet(API.Contents,['data','raw','users',button.attr('data-id')])){
						var user = {raw:API.Contents.data.raw.users[button.attr('data-id')],dom:{}};
						user.dom = API.Contents.data.dom.users[user.raw.username];
					} else {
						var user = {
							dom:dataset.details.users.dom[button.attr('data-id')],
							raw:dataset.details.users.raw[button.attr('data-id')],
						};
					}
				}
				switch(button.attr('data-action')){
					case"details":
						API.CRUD.read.show({ key:'username',keys:user.dom, href:"?p=users&v=details&id="+user.raw.username, modal:true });
						break;
					case"unassign":
						API.request('organizations','unassign',{data:{id:dataset.this.raw.id,user:button.attr('data-id')}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								td.find('.btn-group[data-id="'+sub_dataset.output.user+'"]').remove();
							}
						});
						break;
					case"assign":
						API.Builder.modal($('body'), {
							title:'Assign a user',
							icon:'user',
							zindex:'top',
							css:{ header: "bg-gray", body: "p-3"},
						}, function(modal){
							modal.on('hide.bs.modal',function(){ modal.remove(); });
							var dialog = modal.find('.modal-dialog');
							var header = modal.find('.modal-header');
							var body = modal.find('.modal-body');
							var footer = modal.find('.modal-footer');
							header.find('button[data-control="hide"]').remove();
							header.find('button[data-control="update"]').remove();
							API.Builder.input(body, 'user', null, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="assign"><i class="fas fa-user-plus mr-1"></i>'+API.Contents.Language['Assign']+'</button>');
							footer.find('button[data-action="assign"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									API.request('organizations','assign',{data:{id:dataset.this.dom.id,user:body.find('select').select2('val')}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											for(var [key, user] of Object.entries(sub_dataset.output.organization.raw.assigned_to.split(';'))){
												if(user != '' && td.find('div.btn-group[data-id="'+user+'"]').length <= 0){
													user = {
														dom:sub_dataset.output.users.dom[user],
														raw:sub_dataset.output.users.raw[user],
													};
													API.Helper.set(API.Contents,['data','dom','users',user.dom.username],user.dom);
													API.Helper.set(API.Contents,['data','raw','users',user.raw.id],user.raw);
													API.Helper.set(dataset.details,['users','dom',user.dom.id],user.dom);
													API.Helper.set(dataset.details,['users','dom',user.raw.id],user.raw);
													var html = API.Plugins.organizations.GUI.buttons.details(user.dom,{
														remove:API.Auth.validate('custom', 'organizations_users', 4),
													  key: "username",
													  icon:{
													    details:"fas fa-user",
													    remove:"fas fa-user-minus",
													  },
													  action:{
													    remove:"unassign",
													  },
													});
													if(td.find('button[data-action="assign"]').length > 0){
														td.find('button[data-action="assign"]').before(html);
													} else { td.append(html); }
												}
											}
											API.Plugins.organizations.Events.users(dataset,layout);
										}
									});
									modal.modal('hide');
								} else {
									body.find('.input-group').addClass('is-invalid');
									alert('No organization were selected!');
								}
							});
							modal.modal('show');
						});
						break;
				}
			});
			if(callback != null){ callback(dataset,layout); }
		},
		notes:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			if(API.Auth.validate('custom', 'organizations_notes', 2)){
				layout.content.notes.find('button').off().click(function(){
				  if(!layout.content.notes.find('textarea').summernote('isEmpty')){
				    var note = {
				      by:API.Contents.Auth.User.id,
				      content:layout.content.notes.find('textarea').summernote('code'),
				      relationship:'organizations',
				      link_to:dataset.this.dom.id,
				      status:dataset.this.raw.status,
				    };
				    if(API.Helper.isSet(API.Plugins,['statuses']) && API.Auth.validate('custom', 'organizations_status', 1)){
				      note.status = layout.content.notes.find('select').val();
				    }
				    layout.content.notes.find('textarea').val('');
				    layout.content.notes.find('textarea').summernote('code','');
				    layout.content.notes.find('textarea').summernote('destroy');
				    layout.content.notes.find('textarea').summernote({
				      toolbar: [
				        ['font', ['fontname', 'fontsize']],
				        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
				        ['color', ['color']],
				        ['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
				      ],
				      height: 250,
				    });
				    API.request('organizations','note',{data:note},function(result){
				      var data = JSON.parse(result);
				      if(data.success != undefined){
				        if(data.output.status != null){
				          var status = {};
				          for(var [key, value] of Object.entries(data.output.status)){ status[key] = value; }
				          status.created = data.output.note.raw.created;
				          API.Builder.Timeline.add.status(layout.timeline,status);
				          layout.content.notes.find('select').val(status.order);
				          layout.details.find('td[data-plugin="organizations"][data-key="status"]').html('<span class="badge bg-'+API.Contents.Statuses.organizations[status.order].color+'"><i class="'+API.Contents.Statuses.organizations[status.order].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses.organizations[status.order].name]+'</span>');
				        }
				        API.Builder.Timeline.add.card(layout.timeline,data.output.note.dom,'sticky-note','warning',function(item){
				          item.find('.timeline-footer').remove();
				          if(API.Auth.validate('custom', 'organizations_notes', 4)){
				            $('<a class="time bg-warning pointer"><i class="fas fa-trash-alt"></i></a>').insertAfter(item.find('span.time.bg-warning'));
										item.find('a.pointer').off().click(function(){
											API.CRUD.delete.show({ keys:data.output.note.dom,key:'id', modal:true, plugin:'notes' },function(note){
												item.remove();
											});
										});
				          }
				        });
				      }
				    });
				    layout.tabs.find('a').first().tab('show');
				  } else {
				    layout.content.notes.find('textarea').summernote('destroy');
				    layout.content.notes.find('textarea').summernote({
				      toolbar: [
				        ['font', ['fontname', 'fontsize']],
				        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
				        ['color', ['color']],
				        ['paragraph', ['style', 'ul', 'ol', 'paragraph', 'height']],
				      ],
				      height: 250,
				    });
				    alert(API.Contents.Language['Note is empty']);
				  }
				});
			}
		},
		contacts:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var contacts = layout.content.contacts.find('div.row').eq(1);
			var search = layout.content.contacts.find('div.row').eq(0);
			var skeleton = {};
			for(var [field, settings] of Object.entries(API.Contents.Settings.Structure.contacts)){ skeleton[field] = ''; }
			search.find('div[data-action="clear"]').off().click(function(){
				$(this).parent().find('input').val('');
				contacts.find('[data-csv]').show();
			});
			search.find('input').off().on('input',function(){
				if($(this).val() != ''){
					contacts.find('[data-csv]').hide();
					contacts.find('[data-csv*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
				} else { contacts.find('[data-csv]').show(); }
			});
			if(API.Auth.validate('custom', 'organizations_contacts', 2)){
				contacts.find('.addContact').off().click(function(){
					API.CRUD.create.show({ plugin:'contacts', keys:skeleton, set:{isActive:'true',relationship:'organizations',link_to:dataset.this.raw.id} },function(created,user){
						if(created){
							user.dom.name = '';
							if((user.dom.first_name != '')&&(user.dom.first_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.first_name; }
							if((user.dom.middle_name != '')&&(user.dom.middle_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.middle_name; }
							if((user.dom.last_name != '')&&(user.dom.last_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.last_name; }
							API.Helper.set(dataset,['details','contacts','dom',user.dom.id],user.dom);
							API.Helper.set(dataset,['details','contacts','raw',user.raw.id],user.raw);
							API.Helper.set(dataset,['relations','contacts',user.dom.id],user.dom);
							API.Plugins.organizations.GUI.contact(user.dom,layout);
							API.Plugins.organizations.Events.contacts(dataset,layout);
							API.Builder.Timeline.add.contact(layout.timeline,user.dom,'address-card','secondary',function(item){
								item.find('i').first().addClass('pointer');
								item.find('i').first().off().click(function(){
									value = item.attr('data-name').toLowerCase();
									layout.content.contacts.find('input').val(value);
									layout.tabs.contacts.find('a').tab('show');
									layout.content.contacts.find('[data-csv]').hide();
									layout.content.contacts.find('[data-csv*="'+value+'"]').each(function(){ $(this).show(); });
								});
							});
						}
					});
				});
			}
			contacts.find('button').off().click(function(){
				var contact = dataset.relations.contacts[$(this).attr('data-id')];
				switch($(this).attr('data-action')){
					case"call":
						var now = new Date();
						var call = {
							date:now,
							time:now,
							contact:contact.id,
							status:3,
							assigned_to:API.Contents.Auth.User.id,
							relationship:'organizations',
							link_to:dataset.this.raw.id,
						};
						API.request('calls','create',{data:call},function(result){
							var record = JSON.parse(result);
							if(typeof record.success !== 'undefined'){
								API.Helper.set(dataset,['details','calls','dom',record.output.dom.id],record.output.dom);
								API.Helper.set(dataset,['details','calls','raw',record.output.raw.id],record.output.raw);
								API.Helper.set(dataset,['relations','calls',record.output.dom.id],record.output.dom);
								API.Plugins.calls.Events.create(dataset,record.output.raw);
							}
						});
						break;
					case"edit":
						API.CRUD.update.show({ keys:contact, modal:true, plugin:'contacts' },function(user){
							user.dom.name = '';
							if((user.dom.first_name != '')&&(user.dom.first_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.first_name; }
							if((user.dom.middle_name != '')&&(user.dom.middle_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.middle_name; }
							if((user.dom.last_name != '')&&(user.dom.last_name != null)){ if(user.dom.name != ''){user.dom.name += ' ';} user.dom.name += user.dom.last_name; }
							API.Helper.set(dataset,['relations','contacts',user.dom.id],user.dom);
							contacts.find('[data-id="'+user.raw.id+'"]').remove();
							API.Plugins.organizations.GUI.contact(user.dom,layout);
							API.Plugins.organizations.Events.contacts(dataset,layout);
						});
						break;
					case"delete":
						contact.link_to = dataset.this.raw.id;
						API.CRUD.delete.show({ keys:contact,key:'name', modal:true, plugin:'contacts' },function(user){
							if(contacts.find('[data-id="'+contact.id+'"]').find('.ribbon-wrapper').length > 0 || !API.Auth.validate('custom', 'organizations_contacts_isActive', 1)){
								contacts.find('[data-id="'+contact.id+'"]').remove();
								layout.timeline.find('[data-type="address-card"][data-id="'+contact.id+'"]').remove();
							}
							if(contact.isActive && API.Auth.validate('custom', 'organizations_contacts_isActive', 1)){
								contact.isActive = user.isActive;
								API.Helper.set(dataset,['relations','contacts',contact.id,'isActive'],contact.isActive);
								contacts.find('[data-id="'+contact.id+'"] .card').prepend('<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">'+API.Contents.Language['Inactive']+'</div></div>');
							}
						});
						break;
				}
			});
			if(callback != null){ callback(dataset,layout); }
		},
		calls:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var calls = layout.content.calls.find('div.row').eq(1);
			var search = layout.content.calls.find('div.row').eq(0);
			var skeleton = {};
			for(var [field, settings] of Object.entries(API.Contents.Settings.Structure.calls)){ skeleton[field] = ''; }
			search.find('div[data-action="clear"]').off().click(function(){
				$(this).parent().find('input').val('');
				calls.find('[data-csv]').show();
			});
			search.find('input').off().on('input',function(){
				if($(this).val() != ''){
					calls.find('[data-csv]').hide();
					calls.find('[data-csv*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
				} else { calls.find('[data-csv]').show(); }
			});
			calls.find('tr td.pointer').off().click(function(){
				API.CRUD.read.show({ key:{id:$(this).parent().attr('data-id')}, title:$(this).parent().attr('data-phone'), href:"?p=calls&v=details&id="+$(this).parent().attr('data-id'), modal:true });
			});
			calls.find('tr td button').off().click(function(){
				var button = $(this);
				var tr = button.parents().eq(2);
				var call = dataset.relations.calls[tr.attr('data-id')];
				switch(button.attr('data-action')){
					case"end":
						API.Plugins.calls.Events.end(dataset,call);
						break;
				}
			});
		},
		callbacks:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(API.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var calls = layout.content.callbacks.find('div.row').eq(1);
			var search = layout.content.callbacks.find('div.row').eq(0);
			var skeleton = {};
			for(var [field, settings] of Object.entries(API.Contents.Settings.Structure.calls)){ skeleton[field] = ''; }
			search.find('div[data-action="clear"]').off().click(function(){
				$(this).parent().find('input').val('');
				calls.find('[data-csv]').show();
			});
			search.find('input').off().on('input',function(){
				if($(this).val() != ''){
					calls.find('[data-csv]').hide();
					calls.find('[data-csv*="'+$(this).val().toLowerCase()+'"]').each(function(){ $(this).show(); });
				} else { calls.find('[data-csv]').show(); }
			});
			search.find('button[data-action="create"]').off().click(function(){
				API.Builder.modal($('body'), {
					title:'Create a callback',
					icon:'callback',
					zindex:'top',
					css:{ dialog: "modal-lg", header: "bg-success", body: "p-3"},
				}, function(modal){
					modal.on('hide.bs.modal',function(){ modal.remove(); });
					var dialog = modal.find('.modal-dialog');
					var header = modal.find('.modal-header');
					var body = modal.find('.modal-body');
					var footer = modal.find('.modal-footer');
					header.find('button[data-control="hide"]').remove();
					header.find('button[data-control="update"]').remove();
					body.html('<div class="row"></div>');
					API.Builder.input(body.find('div.row'), 'date', null,{plugin:'organizations'}, function(input){
						input.wrap('<div class="col-md-6"></div>');
					});
					API.Builder.input(body.find('div.row'), 'time', null,{plugin:'organizations'}, function(input){
						input.wrap('<div class="col-md-6"></div>');
					});
					if(API.Helper.isSet(dataset,['relations','contacts'])){
						var contacts = {};
						for(var [id, values] of Object.entries(dataset.relations.contacts)){
							contacts[id] = '';
							if(values.name != ''){ if(contacts[id] != ''){ contacts[id] += ' - '+values.name; } else { contacts[id] += values.name; } }
							if(values.job_title != ''){ if(contacts[id] != ''){ contacts[id] += ' - '+values.job_title; } else { contacts[id] += values.job_title; } }
							if(values.phone != ''){ if(contacts[id] != ''){ contacts[id] += ' - '+values.phone; } else { contacts[id] += values.phone; } }
							if(values.email != ''){ if(contacts[id] != ''){ contacts[id] += ' - '+values.email; } else { contacts[id] += values.email; } }
						}
						API.Builder.input(body.find('div.row'), 'contact', null,{plugin:'organizations',list:{contacts:contacts}}, function(input){
							input.wrap('<div class="col-md-12 mt-3"></div>');
						});
					}
					footer.append('<button class="btn btn-success" data-action="create"><i class="fas fa-phone-square mr-1"></i>'+API.Contents.Language['Create']+'</button>');
					footer.find('button[data-action="create"]').click(function(){
						var call = {
							date:body.find('input[data-key="date"]').val(),
							time:body.find('input.datetimepicker-input[data-key="time"]').val(),
							contact:body.find('select').select2('val'),
							status:1,
							assigned_to:API.Contents.Auth.User.id,
							relationship:'organizations',
							link_to:dataset.this.raw.id,
						};
						API.request('calls','create',{data:call},function(result){
							var response = JSON.parse(result);
							if(typeof response.success !== 'undefined'){
								API.Helper.set(dataset,['details','calls','dom',response.output.dom.id],response.output.dom);
								API.Helper.set(dataset,['details','calls','raw',response.output.raw.id],response.output.raw);
								API.Helper.set(dataset,['relations','calls',response.output.dom.id],response.output.dom);
								API.Plugins.organizations.GUI.call(dataset,layout,response.output.dom);
								API.Plugins.organizations.Events.callbacks(dataset,layout);
								API.Builder.Timeline.add.call(layout.timeline,response.output.dom,'phone-square','olive',function(item){
									item.find('i').first().addClass('pointer');
									item.find('i').first().off().click(function(){
										API.CRUD.read.show({ key:{id:item.attr('data-id')}, title:item.attr('data-phone'), href:"?p=calls&v=details&id="+item.attr('data-id'), modal:true });
									});
								});
							}
						});
						modal.modal('hide');
					});
					modal.modal('show');
				});
			});
			calls.find('tr td.pointer').off().click(function(){
				API.CRUD.read.show({ key:{id:$(this).parent().attr('data-id')}, title:$(this).parent().attr('data-phone'), href:"?p=calls&v=details&id="+$(this).parent().attr('data-id'), modal:true });
			});
			calls.find('tr td button').off().click(function(){
				var button = $(this);
				var tr = button.parents().eq(2);
				var call = dataset.relations.calls[tr.attr('data-id')];
				switch(button.attr('data-action')){
					case"start":
						API.Plugins.calls.Events.start(dataset,call);
						break;
					case"cancel":
						API.Plugins.calls.Events.cancel(dataset,call);
						break;
					case"reschedule":
						API.Plugins.calls.Events.reschedule(dataset,call);
						break;
				}
			});
		},
	},
		// 			// Settings
		// 			if(API.Auth.validate('custom', 'organizations_settings', 1)){
		// 				container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_settings"]').parent().show();
		// 				for(var [key, value] of Object.entries(dataset.output.this.raw)){
		// 					if(key.startsWith("is")){
		// 						var setHTML = '';
		// 						setHTML += '<div class="col-md-6 col-sm-12 my-1">';
		// 							setHTML += '<div class="input-group">';
		// 								setHTML += '<div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-toggle-off mr-1"></i>'+API.Contents.Language[key]+'</span></div>';
		// 								setHTML += '<input type="text" class="form-control switch-spacer" disabled>';
		// 								setHTML += '<div class="input-group-append">';
		// 									setHTML += '<div class="input-group-text p-1">';
		// 										if((value == "yes")||(value == "true")){
		// 											setHTML += '<input type="checkbox" data-key="'+key+'" title="'+API.Contents.Language[key]+'" checked>';
		// 										} else {
		// 											setHTML += '<input type="checkbox" data-key="'+key+'" title="'+API.Contents.Language[key]+'">';
		// 										}
		// 									setHTML += '</div>';
		// 								setHTML += '</div>';
		// 							setHTML += '</div>';
		// 						setHTML += '</div>';
		// 						container.find('#organizations_settings').find('div.row.togglers').append(setHTML);
		// 					}
		// 				}
		// 				container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_settings"]').one("click",function(){
		// 					container.find('#organizations_settings').find('div.row').find('input[type="checkbox"]').each(function(){
		// 						var bootSwitch = $(this);
		// 						if((dataset.output.this.raw[bootSwitch.attr('data-key')] == "true")||(dataset.output.this.raw[bootSwitch.attr('data-key')] == "yes")){
		// 							var currentState = true;
		// 						} else { var currentState = false; }
		// 						bootSwitch.bootstrapSwitch({
		// 							onSwitchChange:function(e,state){
		// 								if(state){ dataset.output.this.raw[bootSwitch.attr('data-key')] = "true"; }
		// 								else { dataset.output.this.raw[bootSwitch.attr('data-key')] = "false"; }
		// 								API.request('organizations','update',{ data:dataset.output.this.raw });
		// 							}
		// 						});
		// 						setTimeout(function(){ bootSwitch.bootstrapSwitch('state',currentState); }, 500);
		// 					});
		// 				});
		// 				var checkSSL = '',checkSTARTTLS = '';
		// 				if(dataset.output.this.raw.setSMTPencryption == 'SSL'){ checkSSL = 'selected="selected"'; }
		// 				if(dataset.output.this.raw.setSMTPencryption == 'STARTTLS'){ checkSTARTTLS = 'selected="selected"'; }
		// 				if(dataset.output.this.raw.setSMTPhost == null){ dataset.output.this.raw.setSMTPhost = ''; }
		// 				if(dataset.output.this.raw.setDomain == null){ dataset.output.this.raw.setDomain = ''; }
		// 				var setHTML = '';
		// 				setHTML += '<div class="col-12 my-1">';
		// 					setHTML += '<div class="input-group">';
		// 						setHTML += '<div class="input-group-prepend">';
		// 							setHTML += '<span class="input-group-text"><i class="fas fa-globe"></i></span>';
		// 						setHTML += '</div>';
		// 						setHTML += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Domain']+'" name="setDomain" value="'+dataset.output.this.raw.setDomain+'">';
		// 					setHTML += '</div>';
		// 				setHTML += '</div>';
		// 				setHTML += '<div class="col-12 my-1">';
		// 					setHTML += '<div class="input-group">';
		// 						setHTML += '<div class="input-group-prepend">';
		// 							setHTML += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
		// 						setHTML += '</div>';
		// 						setHTML += '<input type="text" class="form-control" placeholder="'+API.Contents.Language['Host']+'" name="setSMTPhost" value="'+dataset.output.this.raw.setSMTPhost+'">';
		// 						setHTML += '<div class="input-group-prepend">';
		// 							setHTML += '<span class="input-group-text"><i class="fas fa-key"></i></span>';
		// 						setHTML += '</div>';
		// 						setHTML += '<select name="setSMTPencryption" class="form-control">';
		// 							setHTML += '<option value="SSL" '+checkSSL+'>'+API.Contents.Language['SSL']+'</option>';
		// 							setHTML += '<option value="STARTTLS" '+checkSTARTTLS+'>'+API.Contents.Language['STARTTLS']+'</option>';
		// 						setHTML += '</select>';
		// 						setHTML += '<div class="input-group-prepend">';
		// 							setHTML += '<span class="input-group-text"><i class="fas fa-ethernet"></i></span>';
		// 						setHTML += '</div>';
		// 						setHTML += '<input type="number" class="form-control" placeholder="'+API.Contents.Language['Port']+'" name="setSMTPport" value="'+dataset.output.this.raw.setSMTPport+'">';
		// 					setHTML += '</div>';
		// 				setHTML += '</div>';
		// 				setHTML += '<div class="col-12 my-1">';
		// 					setHTML += '<button type="button" class="btn btn-block btn-success">';
		// 						setHTML += '<i class="fas fa-save mr-1"></i>'+API.Contents.Language['Save'];
		// 					setHTML += '</button>';
		// 				setHTML += '</div>';
		// 				container.find('#organizations_settings').find('div.row.smtp').append(setHTML);
		// 				container.find('#organizations_settings').find('div.row.smtp button').off().click(function(){
		// 					container.find('#organizations_settings').find('div.row.smtp :input').each(function(){
		// 						var input = $(this), value = input.val(), name = input.attr('name');
		// 						if(typeof name !== 'undefined'){
		// 							dataset.output.this.raw[name] = value;
		// 							dataset.output.this.dom[name] = value;
		// 						}
		// 					});
		// 					API.request('organizations','update',{data:dataset.output.this.raw},function(result){
		// 						var data = JSON.parse(result);
		// 						if(typeof data.success !== 'undefined'){}
		// 					});
		// 				});
		// 			} else {
		// 				container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_settings"]').parent().remove();
		// 				container.find('#organizations_settings').remove();
		// 			}
	// 			}
	// 		});
	// 	},
	// },
}

API.Plugins.organizations.init();
