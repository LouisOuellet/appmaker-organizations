Engine.Plugins.organizations = {
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
		Engine.GUI.Sidebar.Nav.add('Organizations', 'main_navigation');
	},
	load:{
		index:function(){
			Engine.Builder.card($('#pagecontent'),{ title: 'Organizations', icon: 'organizations'}, function(card){
				Engine.request('organizations','read',{
					data:{options:{ link_to:'OrganizationsIndex',plugin:'organizations',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(var [key, value] of Object.entries(dataset.output.dom)){ Engine.Helper.set(Engine.Contents,['data','dom','organizations',value.id],value); }
						for(var [key, value] of Object.entries(dataset.output.raw)){ Engine.Helper.set(Engine.Contents,['data','raw','organizations',value.id],value); }
						Engine.Builder.table(card.children('.card-body'), dataset.output.dom, {
							headers:dataset.output.headers,
							id:'OrganizationsIndex',
							modal:true,
							key:'id',
							clickable:{ enable:true, view:'details'},
							set:{isActive:"true"},
							controls:{ toolbar:true},
							import:{ key:'id', },
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
			Engine.request(url.searchParams.get("p"),'get',{data:{id:id,key:'id'}},function(result){
				var dataset = JSON.parse(result);
				if(dataset.success != undefined){
					container.attr('data-id',dataset.output.this.raw.id);
					// GUI
					// Adding Layout
					Engine.GUI.Layouts.details.build(dataset.output,container,{title:"Organization Details",image:"/dist/img/building.png"},function(data,layout){
						if(layout.main.parents().eq(2).parent('.modal-body').length > 0){
							var modal = layout.main.parents().eq(2).parent('.modal-body').parents().eq(2);
							if(Engine.Auth.validate('plugin', 'organizations', 3)){
								modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').off().click(function(){
									Engine.CRUD.update.show({ container:layout.main.parents().eq(2), keys:data.this.raw });
								});
							} else {
								modal.find('.modal-header').find('.btn-group').find('[data-control="update"]').remove();
							}
						}
						if(data.this.dom.isActive || Engine.Auth.validate('custom', 'organizations_isActive', 1)){
							// History
							Engine.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-history",text:Engine.Contents.Language["History"]},function(data,layout,tab,content){
								Engine.Helper.set(Engine.Contents,['layouts','organizations',data.this.raw.id,layout.main.attr('id')],layout);
								content.addClass('p-3');
								content.append('<div class="timeline" data-plugin="organizations"></div>');
								layout.timeline = content.find('div.timeline');
								var today = new Date();
								Engine.Builder.Timeline.add.date(layout.timeline,today);
								layout.timeline.find('.time-label').first().html('<div class="btn-group"></div>');
								layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-primary" data-trigger="all">'+Engine.Contents.Language['All']+'</button>');
								var options = {plugin:"organizations"}
								// Debug
								if(Engine.debug){
									Engine.GUI.Layouts.details.button(data,layout,{icon:"fas fa-stethoscope"},function(data,layout,button){
										button.off().click(function(){
											console.log(data);
											console.log(layout);
										});
									});
								}
								// Clear
								if(Engine.Auth.validate('custom', 'organizations_clear', 1)){
									Engine.GUI.Layouts.details.control(data,layout,{color:"danger",icon:"fas fa-snowplow",text:Engine.Contents.Language["Clear"]},function(data,layout,button){
										button.off().click(function(){
											Engine.request('organizations','clear',{ data:data.this.raw },function(){
												Engine.Plugins.organizations.load.details();
											});
										});
									});
								}
								// Name
								Engine.GUI.Layouts.details.data(data,layout,{field:"name"});
								// Business Number
								if(Engine.Auth.validate('custom', 'organizations_business_num', 1)){
									options.field = "business_num";
									Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								}
								// Code
								if(Engine.Auth.validate('custom', 'organizations_code', 1)){
									options.field = "code";
									options.td = '';
									options.td += '<td>';
										options.td += '<div class="row">';
											if(Engine.Auth.validate('custom', 'organizations_code_ccn', 1) && data.this.dom.setCodeCCN != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><b>'+Engine.Contents.Language.setCodeCCN+': </b></strong><span data-plugin="organizations" data-key="setCodeCCN">'+data.this.dom.setCodeCCN+'</span>';
												options.td += '</div>';
											}
											if(Engine.Auth.validate('custom', 'organizations_code_itmr4', 1) && data.this.dom.setCodeITMR4 != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><b>'+Engine.Contents.Language.setCodeITMR4+': </b></i></strong><span data-plugin="organizations" data-key="setCodeITMR4">'+data.this.dom.setCodeITMR4+'</span>';
												options.td += '</div>';
											}
											if(Engine.Auth.validate('custom', 'organizations_code_hvs', 1) && data.this.dom.setCodeHVS != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><b>'+Engine.Contents.Language.setCodeHVS+': </b></strong><span data-plugin="organizations" data-key="setCodeHVS">'+data.this.dom.setCodeHVS+'</span>';
												options.td += '</div>';
											}
											if(Engine.Auth.validate('custom', 'organizations_code_lvs', 1) && data.this.dom.setCodeLVS != ''){
												options.td += '<div class="col-lg-4 col-md-6 p-1">';
													options.td += '<strong><b>'+Engine.Contents.Language.setCodeLVS+': </b></strong><span data-plugin="organizations" data-key="setCodeLVS">'+data.this.dom.setCodeLVS+'</span>';
												options.td += '</div>';
											}
										options.td += '</div>';
									options.td += '</td>';
									Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								}
								// Status
								if(Engine.Helper.isSet(Engine.Plugins,['statuses']) && Engine.Auth.validate('custom', 'organizations_status', 1)){
									if(!data.this.dom.isActive){
										layout.details.prepend('<div class="ribbon-wrapper ribbon-xl"><div class="ribbon bg-danger text-xl">Inactive</div></div>');
									}
									Engine.Plugins.statuses.Layouts.details.detail(data,layout);
								}
								// Address
								options.field = "address";
								options.td = '<td data-plugin="organizations">';
									options.td += '<span data-plugin="organizations" data-key="address">'+data.this.dom.address+'</span>, ';
									options.td += '<span data-plugin="organizations" data-key="city">'+data.this.dom.city+'</span>, ';
									options.td += '<span data-plugin="organizations" data-key="zipcode">'+data.this.dom.zipcode+'</span>';
								options.td += '</td>';
								Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								// Phone
								if(Engine.Auth.validate('custom', 'organizations_phone', 1)){
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
									Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								}
								// Email
								options.field = "email";
								options.td = '<td><strong><i class="fas fa-envelope mr-1"></i></strong><a href="mailto:'+data.this.dom.email+'" data-plugin="organizations" data-key="'+options.field+'">'+data.this.dom.email+'</a></td>';
								Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								// Website
								options.field = "website";
								options.td = '<td><strong><i class="fas fa-globe mr-1"></i></strong><a href="'+data.this.dom.website+'" data-plugin="organizations" data-key="'+options.field+'">'+data.this.dom.website+'</a></td>';
								Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){});
								// Organizations
								if(Engine.Auth.validate('custom', 'organizations_organizations', 1)){
									Engine.Plugins.organizations.Layouts.details.detail(data,layout);
								}
								// Services
								if(Engine.Helper.isSet(Engine.Plugins,['services']) && Engine.Auth.validate('custom', 'organizations_services', 1)){
									layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="services">'+Engine.Contents.Language['Services']+'</button>');
									options.field = "services";
									if(Engine.Helper.isSet(options,['td'])){ delete options.td; }
									Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="services"]');
										if(Engine.Helper.isSet(data.details,['services'])){
											for(var [subKey, subDetails] of Object.entries(data.details.services.dom)){
												td.append(Engine.Plugins.organizations.GUI.buttons.details(subDetails,{remove:Engine.Auth.validate('custom', 'organizations_services', 4),icon:{details:"fas fa-hand-holding-usd"}}));
											}
										}
										if(Engine.Auth.validate('custom', 'organizations_services', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link"><i class="fas fa-link"></i></button>');
										}
										Engine.Plugins.organizations.Events.services(data,layout);
									});
								}
								// Issues
								if(Engine.Helper.isSet(Engine.Plugins,['issues']) && Engine.Auth.validate('custom', 'organizations_issues', 1)){
									layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="issues">'+Engine.Contents.Language['Issues']+'</button>');
									options.field = "issues";
									if(Engine.Helper.isSet(options,['td'])){ delete options.td; }
									var issues = {};
									for(var [rid, relations] of Object.entries(data.relationships)){
										for(var [uid, relation] of Object.entries(relations)){
											if(relation.relationship == 'issues'){ issues[relation.link_to] = relation.statuses; }
										}
									}
									Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="issues"]');
										if(Engine.Helper.isSet(data.details,['issues'])){
											for(var [subKey, subDetails] of Object.entries(data.relations.issues)){
												td.append(
													Engine.Plugins.organizations.GUI.buttons.details(subDetails,{
														remove:Engine.Auth.validate('custom', 'organizations_issues', 4),
														content:subDetails.id+' - '+subDetails.name+' - '+Engine.Contents.Language[Engine.Contents.Statuses.issues[subDetails.status].name],
														color:{
															details:Engine.Contents.Statuses.issues[subDetails.status].color
														},
														icon:{
															details:Engine.Contents.Statuses.issues[subDetails.status].icon
														},
													})
												);
											}
										}
										if(Engine.Auth.validate('custom', 'organizations_issues', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link"><i class="fas fa-link"></i></button>');
										}
										Engine.Plugins.organizations.Events.issues(data,layout);
									});
								}
								// Tags
								if(Engine.Helper.isSet(Engine.Plugins,['tags']) && Engine.Auth.validate('custom', 'organizations_tags', 1)){
									options.field = "tags";
									options.td = '<td data-plugin="organizations" data-key="'+options.field+'"></td>';
									Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="tags"]');
										if(data.this.dom.tags == null){ data.this.dom.tags = ''; }
										for(var [subKey, subDetails] of Object.entries(Engine.Helper.trim(data.this.dom.tags,';').split(';'))){
											if(subDetails != ''){
												td.append(
													Engine.Plugins.organizations.GUI.buttons.details({name:subDetails},{
														remove:Engine.Auth.validate('custom', 'organizations_tags', 4),
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
										if(Engine.Auth.validate('custom', 'organizations_tags', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="tag"><i class="fas fa-plus"></i></button>');
										}
										Engine.Plugins.organizations.Events.tags(data,layout);
									});
								}
								// Notes
								if(Engine.Helper.isSet(Engine.Plugins,['notes']) && Engine.Auth.validate('custom', 'organizations_notes', 1)){
									Engine.Plugins.notes.Layouts.details.tab(data,layout);
								}
								// Contacts
								if(Engine.Helper.isSet(Engine.Plugins,['contacts']) && Engine.Auth.validate('custom', 'organizations_contacts', 1)){
									Engine.Plugins.contacts.Layouts.details.tab(data,layout);
								}
								// Files
								if(Engine.Helper.isSet(Engine.Plugins,['files']) && Engine.Auth.validate('custom', 'conversations_files', 1)){
									Engine.Plugins.files.Layouts.details.tab(data,layout);
								}
								// Calls
								if(Engine.Helper.isSet(Engine.Plugins,['calls']) && Engine.Auth.validate('custom', 'organizations_calls', 1)){
									Engine.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-phone-square",text:Engine.Contents.Language["Calls"]},function(data,layout,tab,content){
										Engine.GUI.Layouts.details.control(data,layout,{color:"success",icon:"fas fa-phone",text:Engine.Contents.Language["Call"]},function(data,layout,button){
											button.off().click(function(){
												var now = new Date();
												var call = {
													date:now,
													time:now,
													status:3,
													assigned_to:Engine.Contents.Auth.User.id,
													relationship:'organizations',
													link_to:data.this.raw.id,
												};
												Engine.request('calls','create',{data:call},function(result){
													var record = JSON.parse(result);
													if(typeof record.success !== 'undefined'){
														Engine.Helper.set(data,['details','calls','dom',record.output.dom.id],record.output.dom);
														Engine.Helper.set(data,['details','calls','raw',record.output.raw.id],record.output.raw);
														Engine.Helper.set(data,['relations','calls',record.output.dom.id],record.output.dom);
														Engine.Plugins.calls.Events.create(data,record.output.raw);
													}
												});
											});
										});
										layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="calls">'+Engine.Contents.Language['Calls']+'</button>');
										layout.content.calls = content;
										layout.tabs.calls = tab;
										var html = '';
										html += '<div class="row p-3">';
											html += '<div class="col-md-12">';
												html += '<div class="input-group">';
													html += '<input type="text" class="form-control">';
													html += '<div class="input-group-append pointer" data-action="clear"><span class="input-group-text"><i class="fas fa-times"></i></span></div>';
													html += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+Engine.Contents.Language['Search']+'</span></div>';
												html += '</div>';
											html += '</div>';
										html += '</div>';
										html += '<div class="row px-2 py-0">';
											html += '<table class="table table-sm table-striped table-hover mb-0">';
					              html += '<thead>';
					                html += '<tr>';
					                  html += '<th data-header="schedule">'+Engine.Contents.Language['Schedule']+'</th>';
					                  html += '<th data-header="status">'+Engine.Contents.Language['Status']+'</th>';
														if(Engine.Auth.validate('custom', 'organizations_calls_phone', 1)){
					                  	html += '<th data-header="phone">'+Engine.Contents.Language['Phone']+'</th>';
														}
					                  html += '<th data-header="contact">'+Engine.Contents.Language['Contact']+'</th>';
					                  html += '<th data-header="assigned_to">'+Engine.Contents.Language['Assigned to']+'</th>';
														if((!Engine.Helper.isSet(Engine.Contents.Auth.Options,['application','showInlineCallsControls','value']) && Engine.Contents.Settings.customization.showInlineCallsControls.value)||(Engine.Helper.isSet(Engine.Contents.Auth.Options,['application','showInlineCallsControls','value']) && Engine.Contents.Auth.Options.application.showInlineCallsControls.value)){
					                  	html += '<th data-header="action">'+Engine.Contents.Language['Action']+'</th>';
														}
					                html += '</tr>';
					              html += '</thead>';
					              html += '<tbody></tbody>';
					            html += '</table>';
						        html += '</div>';
										content.append(html);
										if(Engine.Helper.isSet(data,['relations','calls'])){
											for(var [id, relation] of Object.entries(data.relations.calls)){
												if(relation.status > 2){ Engine.Plugins.organizations.GUI.call(data,layout,relation); }
											}
										}
										Engine.Plugins.organizations.Events.calls(data,layout);
									});
								}
								// Callbacks
								if(Engine.Helper.isSet(Engine.Plugins,['callbacks']) && Engine.Auth.validate('custom', 'organizations_callbacks', 1)){
									Engine.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-phone-square",text:Engine.Contents.Language["Callbacks"]},function(data,layout,tab,content){
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
													html += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+Engine.Contents.Language['Search']+'</span></div>';
												html += '</div>';
											html += '</div>';
										html += '</div>';
										html += '<div class="row px-2 py-0">';
											html += '<table class="table table-sm table-striped table-hover mb-0">';
					              html += '<thead>';
					                html += '<tr>';
					                  html += '<th data-header="schedule">'+Engine.Contents.Language['Schedule']+'</th>';
					                  html += '<th data-header="status">'+Engine.Contents.Language['Status']+'</th>';
														if(Engine.Auth.validate('custom', 'organizations_calls_phone', 1)){
					                  	html += '<th data-header="phone">'+Engine.Contents.Language['Phone']+'</th>';
														}
					                  html += '<th data-header="contact">'+Engine.Contents.Language['Contact']+'</th>';
					                  html += '<th data-header="assigned_to">'+Engine.Contents.Language['Assigned to']+'</th>';
														if((!Engine.Helper.isSet(Engine.Contents.Auth.Options,['application','showInlineCallsControls','value']) && Engine.Contents.Settings.customization.showInlineCallsControls.value)||(Engine.Helper.isSet(Engine.Contents.Auth.Options,['application','showInlineCallsControls','value']) && Engine.Contents.Auth.Options.application.showInlineCallsControls.value)){
					                  	html += '<th data-header="action">'+Engine.Contents.Language['Action']+'</th>';
														}
					                html += '</tr>';
					              html += '</thead>';
					              html += '<tbody></tbody>';
					            html += '</table>';
						        html += '</div>';
										content.append(html);
										if(Engine.Helper.isSet(data,['relations','calls'])){
											for(var [id, relation] of Object.entries(data.relations.calls)){
												if(relation.status <= 2){ Engine.Plugins.organizations.GUI.call(data,layout,relation); }
											}
										}
										Engine.Plugins.organizations.Events.callbacks(data,layout);
									});
								}
								// Users
								if(Engine.Helper.isSet(Engine.Plugins,['users']) && Engine.Auth.validate('custom', 'organizations_users', 1)){
									layout.timeline.find('.time-label').first().find('div.btn-group').append('<button class="btn btn-secondary" data-table="users">'+Engine.Contents.Language['Users']+'</button>');
									options.field = "assigned_to";
									options.td = '<td data-plugin="organizations" data-key="'+options.field+'"></td>';
									Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){
										var td = tr.find('td[data-plugin="organizations"][data-key="assigned_to"]');
										if(Engine.Helper.isSet(data.details,['users'])){
											if(data.this.raw.assigned_to == null){ data.this.raw.assigned_to = ''; }
											for(var [subKey, subDetails] of Object.entries(Engine.Helper.trim(data.this.raw.assigned_to,';').split(';'))){
												if(subDetails != ''){
													var user = data.details.users.dom[subDetails];
													td.append(
														Engine.Plugins.organizations.GUI.buttons.details(user,{
															remove:Engine.Auth.validate('custom', 'organizations_users', 4),
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
										if(Engine.Auth.validate('custom', 'organizations_users', 2)){
											td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="assign"><i class="fas fa-user-plus"></i></button>');
										}
										Engine.Plugins.organizations.Events.users(data,layout);
									});
								}
								// Settings
								if(Engine.Auth.validate('custom', 'organizations_settings', 1)){
									Engine.GUI.Layouts.details.tab(data,layout,{icon:"fas fa-cog",text:Engine.Contents.Language["Settings"]},function(data,layout,tab,content){
										layout.content.settings = content;
										layout.tabs.settings = tab;
										html = '';
										content.append(html);
										// Engine.Plugins.organizations.Events.settings(data,layout);
									});
								}
								// Created
								options.field = "created";
								options.td = '<td><time class="timeago" datetime="'+data.this.raw.created.replace(/ /g, "T")+'" title="'+data.this.raw.created+'">'+data.this.raw.created+'</time></td>';
								Engine.GUI.Layouts.details.data(data,layout,options,function(data,layout,tr){ tr.find('time').timeago(); });
								// Subscription
								var icon = "fas fa-bell";
								if(Engine.Helper.isSet(data,['relations','users',Engine.Contents.Auth.User.id])){ var icon = "fas fa-bell-slash"; }
								Engine.GUI.Layouts.details.button(data,layout,{icon:icon},function(data,layout,button){
									button.off().click(function(){
										if(button.find('i').hasClass( "fa-bell" )){
											button.find('i').removeClass("fa-bell").addClass("fa-bell-slash");
											Engine.request("organizations",'subscribe',{data:{id:data.this.raw.id}},function(answer){
												var subscription = JSON.parse(answer);
												if(subscription.success != undefined){
													var sub = {};
													for(var [key, value] of Object.entries(Engine.Contents.Auth.User)){ sub[key] = value; }
													sub.created = subscription.output.relationship.created;
													sub.name = '';
													if((sub.first_name != '')&&(sub.first_name != null)){ if(sub.name != ''){sub.name += ' ';} sub.name += sub.first_name; }
													if((sub.middle_name != '')&&(sub.middle_name != null)){ if(sub.name != ''){sub.name += ' ';} sub.name += sub.middle_name; }
													if((sub.last_name != '')&&(sub.last_name != null)){ if(sub.name != ''){sub.name += ' ';} sub.name += sub.last_name; }
													Engine.Builder.Timeline.add.subscription(layout.timeline,sub,'bell','lightblue',function(item){
														if((Engine.Auth.validate('plugin','users',1))&&(Engine.Auth.validate('view','details',1,'users'))){
															item.find('i').first().addClass('pointer');
															item.find('i').first().off().click(function(){
																Engine.CRUD.read.show({ key:'username',keys:data.relations.users[item.attr('data-id')], href:"?p=users&v=details&id="+data.relations.users[item.attr('data-id')].username, modal:true });
															});
														}
													});
												}
											});
										} else {
											button.find('i').removeClass("fa-bell-slash").addClass("fa-bell");
											Engine.request(url.searchParams.get("p"),'unsubscribe',{data:{id:dataset.output.this.raw.id}},function(answer){
												var subscription = JSON.parse(answer);
												if(subscription.success != undefined){
													layout.timeline.find('[data-type="bell"][data-id="'+Engine.Contents.Auth.User.id+'"]').remove();
												}
											});
										}
									});
								});
								// Timeline
								Engine.Builder.Timeline.render(data,layout,{prefix:"organizations_"});
								// for(var [rid, relations] of Object.entries(data.relationships)){
								// 	for(var [uid, relation] of Object.entries(relations)){
								// 		if(Engine.Helper.isSet(Engine.Plugins,[relation.relationship]) && (Engine.Auth.validate('custom', 'organizations_'+relation.relationship, 1) || relation.owner == Engine.Contents.Auth.User.username) && Engine.Helper.isSet(data,['relations',relation.relationship,relation.link_to])){
								// 			var details = {};
								// 			for(var [key, value] of Object.entries(data.relations[relation.relationship][relation.link_to])){ details[key] = value; }
								// 			if(typeof relation.statuses !== 'undefined'){ details.status = data.details.statuses.dom[relation.statuses].order; }
								// 			details.created = relation.created;
								// 			details.owner = relation.owner;
								// 			if(!Engine.Helper.isSet(details,['isActive'])||(Engine.Helper.isSet(details,['isActive']) && details.isActive)||(Engine.Helper.isSet(details,['isActive']) && !details.isActive && (Engine.Auth.validate('custom', 'organizations_'+relation.relationship+'_isActive', 1)||Engine.Auth.validate('custom', relation.relationship+'_isActive', 1)))){
								// 				switch(relation.relationship){
								// 					case"services":
								// 						Engine.Builder.Timeline.add.service(layout.timeline,details,'hand-holding-usd','success',function(item){
								// 							if((Engine.Auth.validate('plugin','services',1))&&(Engine.Auth.validate('view','details',1,'services'))){
								// 								item.find('i').first().addClass('pointer');
								// 								item.find('i').first().off().click(function(){
								// 									Engine.CRUD.read.show({ key:'name',keys:data.details.services.dom[item.attr('data-id')], href:"?p=services&v=details&id="+data.details.services.dom[item.attr('data-id')].name, modal:true });
								// 								});
								// 							}
								// 						});
								// 						break;
								// 					case"issues":
								// 						Engine.Builder.Timeline.add.issue(layout.timeline,details,'gavel','indigo',function(item){
								// 							if((Engine.Auth.validate('plugin','issues',1))&&(Engine.Auth.validate('view','details',1,'issues'))){
								// 								item.find('i').first().addClass('pointer');
								// 								item.find('i').first().off().click(function(){
								// 									Engine.CRUD.read.show({ key:'id',keys:data.details.issues.dom[item.attr('data-id')], href:"?p=issues&v=details&id="+data.details.issues.dom[item.attr('data-id')].id, modal:true });
								// 								});
								// 							}
								// 						});
								// 						break;
								// 					case"calls":
								// 						details.status = data.details.statuses.raw[relation.statuses].order;
								// 						details.organization = data.details.calls.raw[details.id].organization;
								// 						Engine.Builder.Timeline.add.call(layout.timeline,details,'phone-square','olive',function(item){
								// 							item.find('i').first().addClass('pointer');
								// 							item.find('i').first().off().click(function(){
								// 								Engine.CRUD.read.show({ key:{id:item.attr('data-id')}, title:item.attr('data-phone'), href:"?p=calls&v=details&id="+item.attr('data-id'), modal:true });
								// 							});
								// 						});
								// 						break;
								// 					case"users":
								// 						Engine.Builder.Timeline.add.subscription(layout.timeline,details,'bell','lightblue',function(item){
								// 							if((Engine.Auth.validate('plugin','users',1))&&(Engine.Auth.validate('view','details',1,'users'))){
								// 								item.find('i').first().addClass('pointer');
								// 								item.find('i').first().off().click(function(){
								// 									Engine.CRUD.read.show({ key:'username',keys:data.details.users.dom[item.attr('data-id')], href:"?p=users&v=details&id="+data.details.users.dom[item.attr('data-id')].username, modal:true });
								// 								});
								// 							}
								// 						});
								// 						break;
								// 				}
								// 			}
								// 		}
								// 	}
								// }
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
	Timeline:{
		icon:"building",
		object:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {icon: Engine.Plugins.organizations.Timeline.icon,color: "lightblue"};
			if(Engine.Helper.isSet(options,['icon'])){ defaults.icon = options.icon; }
			if(Engine.Helper.isSet(options,['color'])){ defaults.color = options.color; }
			if(typeof dataset.id !== 'undefined'){
				var dateItem = new Date(dataset.created);
				var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
				Engine.Builder.Timeline.add.date(layout.timeline,dataset.created);
				var checkExist = setInterval(function() {
					if(layout.timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
						clearInterval(checkExist);
						Engine.Builder.Timeline.add.filter(layout,'organizations','Organizations');
						var html = '';
						html += '<div data-plugin="organizations" data-id="'+dataset.id+'" data-name="'+dataset.name+'" data-date="'+dateItem.getTime()+'">';
							html += '<i class="fas fa-'+defaults.icon+' bg-'+defaults.color+'"></i>';
							html += '<div class="timeline-item">';
								html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+dataset.created.replace(/ /g, "T")+'">'+dataset.created+'</time></span>';
								html += '<h3 class="timeline-header border-0">'+dataset.name+' was linked</h3>';
							html += '</div>';
						html += '</div>';
						layout.timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
						var element = layout.timeline.find('[data-plugin="organizations"][data-id="'+dataset.id+'"]');
						element.find('time').timeago();
						var items = layout.timeline.children('div').detach().get();
						items.sort(function(a, b){
							return new Date($(b).data("date")) - new Date($(a).data("date"));
						});
						layout.timeline.append(items);
						element.find('i').first().addClass('pointer');
						element.find('i').first().off().click(function(){
							Engine.CRUD.read.show({ key:'id',keys:dataset, href:"?p=organizations&v=details&id="+dataset.name, modal:true });
						});
						if(callback != null){ callback(element); }
					}
				}, 100);
			}
		},
	},
	Layouts:{
		details:{
			detail:function(data,layout,options = {},callback = null){
				if(options instanceof Function){ callback = options; options = {}; }
				var url = new URL(window.location.href);
				var defaults = {field: "organizations", plugin:url.searchParams.get("p")};
				for(var [key, option] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
				Engine.Builder.Timeline.add.filter(layout,'organizations','Organizations');
				if(!Engine.Helper.isSet(layout,['details','organizations'])){
					Engine.GUI.Layouts.details.data(data,layout,defaults,function(data,layout,tr){
						var td = tr.find('td[data-plugin="'+url.searchParams.get("p")+'"][data-key="organizations"]');
						td.html('');
						if(Engine.Helper.isSet(data,['relations','organizations'])){
							for(var [id, organization] of Object.entries(data.relations.organizations)){
								if(organization.isActive || Engine.Auth.validate('custom', 'organizations_isActive', 1)){
									td.append(Engine.Plugins.organizations.Layouts.details.GUI.button(organization,{remove:Engine.Auth.validate('custom', url.searchParams.get("p")+'_organizations', 4)}));
								}
							}
						}
						if(Engine.Auth.validate('custom', url.searchParams.get("p")+'_organizations', 2)){
							td.append('<button type="button" class="btn btn-xs btn-success mx-1" data-action="link"><i class="fas fa-link"></i></button>');
						}
						Engine.Plugins.organizations.Layouts.details.Events(data,layout);
						if(callback != null){ callback(data,layout,tr); }
					});
				} else {
					var td = layout.details.organizations.find('td[data-plugin="'+url.searchParams.get("p")+'"][data-key="organizations"]');
					if(Engine.Helper.isSet(data,['relations','organizations'])){
						for(var [id, organization] of Object.entries(data.relations.organizations)){
							if(td.find('div.btn-group[data-id="'+organization.id+'"]').length <= 0){
								if(organization.isActive || Engine.Auth.validate('custom', 'organizations_isActive', 1)){
									td.prepend(Engine.Plugins.organizations.Layouts.details.GUI.button(organization,{remove:Engine.Auth.validate('custom', url.searchParams.get("p")+'_organizations', 4)}));
								}
							}
						}
					}
				}
			},
			GUI:{
				button:function(dataset,options = {},callback = null){
					var url = new URL(window.location.href);
					if(options instanceof Function){ callback = options; options = {}; }
					var defaults = {remove: false};
					for(var [key, option] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
					var html = '<div class="btn-group m-1" data-id="'+dataset.id+'">';
						html += '<button type="button" class="btn btn-xs bg-primary" data-id="'+dataset.id+'" data-name="'+dataset.name+'" data-action="details"><i class="fas fa-building mr-1"></i>'+dataset.name+'</button>';
						if(defaults.remove){
							html += '<button type="button" class="btn btn-xs bg-danger" data-id="'+dataset.id+'" data-name="'+dataset.name+'" data-action="unlink"><i class="fas fa-unlink"></i></button>';
						}
					html += '</div>';
					if(callback != null){ callback(dataset,html); }
					return html;
				},
			},
			Events:function(data,layout,options = {},callback = null){
				var url = new URL(window.location.href);
				if(options instanceof Function){ callback = options; options = {}; }
				var defaults = {};
				for(var [key, option] of Object.entries(options)){ if(Engine.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
				var td = layout.details.find('td[data-plugin="'+url.searchParams.get("p")+'"][data-key="organizations"]');
				td.find('button').off().click(function(){
					var button = $(this);
					if(button.attr('data-action') != "link"){ var organization = data.relations.organizations[button.attr('data-id')]; }
					switch(button.attr('data-action')){
						case"details":
							Engine.CRUD.read.show({ key:'name',keys:organization, href:"?p=organizations&v=details&id="+organization.name, modal:true });
							break;
						case"unlink":
							Engine.request('organizations','unlink',{data:{id:data.this.raw.id,relationship:{relationship:'organizations',link_to:organization.id}}},function(result){
								var dataset = JSON.parse(result);
								if(dataset.success != undefined){
									layout.timeline.find('[data-plugin="organizations"][data-id="'+dataset.output.id+'"]').remove();
									td.find('.btn-group[data-id="'+dataset.output.id+'"]').remove();
								}
							});
							break;
						case"link":
							Engine.Builder.modal($('body'), {
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
								Engine.Builder.input(body, 'organization', null,{plugin:'organizations'}, function(input){});
								footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>'+Engine.Contents.Language['Link']+'</button>');
								footer.find('button[data-action="link"]').click(function(){
									if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
										Engine.request('organizations','link',{data:{id:data.this.dom.id,relationship:{relationship:'organizations',link_to:body.find('select').select2('val')}}},function(result){
											var dataset = JSON.parse(result);
											if(dataset.success != undefined){
												Engine.Helper.set(Engine.Contents,['data','dom','organizations',dataset.output.dom.id],dataset.output.dom);
												Engine.Helper.set(Engine.Contents,['data','raw','organizations',dataset.output.raw.id],dataset.output.raw);
												Engine.Helper.set(data.details,['organizations','dom',dataset.output.dom.id],dataset.output.dom);
												Engine.Helper.set(data.details,['organizations','raw',dataset.output.raw.id],dataset.output.raw);
												Engine.Helper.set(data,['relations','organizations',dataset.output.dom.id],dataset.output.dom);
												var html = Engine.Plugins.organizations.Layouts.details.GUI.button(dataset.output.dom,{remove:Engine.Auth.validate('custom', url.searchParams.get("p")+'_organizations', 4)});
												if(td.find('button[data-action="link"]').length > 0){
													td.find('button[data-action="link"]').before(html);
												} else { td.append(html); }
												dataset.output.dom.owner = dataset.output.timeline.owner;
												dataset.output.dom.created = dataset.output.timeline.created;
												Engine.Plugins[relation.relationship].Timeline.object(dataset.output.dom,layout);
												Engine.Plugins.organizations.Layouts.details.Events(data,layout);
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
		},
	},
	GUI:{
		call:function(dataset,layout,call,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var csv = '';
			for(var [key, value] of Object.entries(call)){
				if(value == null){ value = '';call[key] = value; };
				if(jQuery.inArray(key,['date','time','status','phone','status','contact','assigned_to']) != -1){
					if(key == 'status'){ csv += Engine.Contents.Statuses.calls[call.status].name.replace(',','').toLowerCase()+','; } else {
						if(typeof value == 'string'){ csv += value.replace(',','').toLowerCase()+','; }
						else { csv += value+','; }
					}
				}
			}
			if(call.status > 2){ var body = layout.content.calls.find('tbody'); }
			else { var body = layout.content.callbacks.find('tbody'); }
			var html = '';
			html += '<tr data-csv="'+csv+'" data-id="'+call.id+'" data-phone="'+call.phone+'">';
				html += '<td class="pointer"><span class="badge bg-primary mx-1"><i class="fas fa-calendar-check mr-1"></i>'+call.date+Engine.Contents.Language[' at ']+call.time+'</span></td>';
				html += '<td class="pointer">';
					html += '<span class="mr-1 badge bg-'+Engine.Contents.Statuses.calls[call.status].color+'">';
						html += '<i class="'+Engine.Contents.Statuses.calls[call.status].icon+' mr-1"></i>'+Engine.Contents.Statuses.calls[call.status].name;
					html += '</span>';
				html += '</td>';
				if(Engine.Auth.validate('custom', 'organizations_calls_phone', 1)){
					html += '<td class="pointer"><span class="badge bg-success mx-1"><i class="fas fa-phone mr-1"></i>'+call.phone+'</span></td>';
				}
				if(call.contact != ''){
					html += '<td class="pointer"><span class="badge bg-secondary mx-1"><i class="fas fa-address-card mr-1"></i>'+call.contact+'</span></td>';
				} else {
					html += '<td class="pointer"></td>';
				}
				html += '<td class="pointer"><span class="badge bg-primary mx-1"><i class="fas fa-user mr-1"></i>'+call.assigned_to+'</span></td>';
				if((!Engine.Helper.isSet(Engine.Contents.Auth.Options,['application','showInlineCallsControls','value']) && Engine.Contents.Settings.customization.showInlineCallsControls.value)||(Engine.Helper.isSet(Engine.Contents.Auth.Options,['application','showInlineCallsControls','value']) && Engine.Contents.Auth.Options.application.showInlineCallsControls.value)){
					html += '<td>';
						if(call.status <= 2){
							html += '<div class="btn-group btn-block m-0">';
								html += '<button class="btn btn-xs btn-success" data-action="start"><i class="fas fa-phone mr-1"></i>'+Engine.Contents.Language['Start']+'</button>';
								html += '<button class="btn btn-xs btn-danger" data-action="cancel"><i class="fas fa-phone-slash mr-1"></i>'+Engine.Contents.Language['Cancel']+'</button>';
								html += '<button class="btn btn-xs btn-primary" data-action="reschedule"><i class="fas fa-calendar-day mr-1"></i>'+Engine.Contents.Language['Re-Schedule']+'</button>';
							html += '</div>';
						} else if(call.status <= 3){
							html += '<div class="btn-group btn-block m-0">';
								html += '<button class="btn btn-xs btn-danger" data-action="end"><i class="fas fa-phone-slash mr-1"></i>'+Engine.Contents.Language['End']+'</button>';
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
			if(Engine.Helper.isSet(options,['icon'])){ defaults.icon = options.icon; }
			if(Engine.Helper.isSet(options,['action'])){ defaults.action = options.action; }
			if(Engine.Helper.isSet(options,['color'])){ defaults.color = options.color; }
			if(Engine.Helper.isSet(options,['key'])){ defaults.key = options.key; }
			if(Engine.Helper.isSet(options,['id'])){ defaults.id = options.id; }
			if(Engine.Helper.isSet(options,['content'])){ defaults.content = options.content; }
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
				if(Engine.Helper.isSet(options,['icon','details'])){ defaults.icon.details = options.icon.details; }
				if(Engine.Helper.isSet(options,['icon','remove'])){ defaults.icon.remove = options.icon.remove; }
				if(Engine.Helper.isSet(options,['color','details'])){ defaults.color.details = options.color.details; }
				if(Engine.Helper.isSet(options,['color','remove'])){ defaults.color.remove = options.color.remove; }
				if(Engine.Helper.isSet(options,['action','details'])){ defaults.action.details = options.action.details; }
				if(Engine.Helper.isSet(options,['action','remove'])){ defaults.action.remove = options.action.remove; }
				if(Engine.Helper.isSet(options,['key'])){ defaults.key = options.key; }
				if(Engine.Helper.isSet(options,['id'])){ defaults.id = options.id; }
				if(Engine.Helper.isSet(options,['remove'])){ defaults.remove = options.remove; }
				if(Engine.Helper.isSet(options,['content'])){ defaults.content = options.content; }
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
	},
	Events:{
		subsidiaries:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(Engine.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="subsidiaries"]');
			td.find('button').off().click(function(){
				var button = $(this);
				if(button.attr('data-action') != "link"){ var organization = {raw:dataset.details.organizations.raw[button.attr('data-id')],dom:dataset.details.organizations.dom[button.attr('data-id')]}; }
				switch(button.attr('data-action')){
					case"details":
						Engine.CRUD.read.show({ key:'name',keys:organization.dom, href:"?p=organizations&v=details&id="+organization.raw.name, modal:true });
						break;
					case"unlink":
						Engine.request('organizations','unlink',{data:{id:dataset.this.raw.id,relationship:{relationship:'organizations',link_to:organization.raw.id}}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								layout.timeline.find('[data-type="building"][data-id="'+sub_dataset.output.id+'"]').remove();
								td.find('.btn-group[data-id="'+sub_dataset.output.id+'"]').remove();
							}
						});
						break;
					case"link":
						Engine.Builder.modal($('body'), {
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
							Engine.Builder.input(body, 'organization', null,{plugin:'organizations'}, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>'+Engine.Contents.Language['Link']+'</button>');
							footer.find('button[data-action="link"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									Engine.request('organizations','link',{data:{id:dataset.this.dom.id,relationship:{relationship:'organizations',link_to:body.find('select').select2('val')}}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											Engine.Helper.set(Engine.Contents,['data','dom','organizations',sub_dataset.output.dom.id],sub_dataset.output.dom);
											Engine.Helper.set(Engine.Contents,['data','raw','organizations',sub_dataset.output.raw.id],sub_dataset.output.raw);
											Engine.Helper.set(dataset.details,['organizations','dom',sub_dataset.output.dom.id],sub_dataset.output.dom);
											Engine.Helper.set(dataset.details,['organizations','raw',sub_dataset.output.raw.id],sub_dataset.output.raw);
											Engine.Helper.set(dataset,['relations','organizations',sub_dataset.output.dom.id],sub_dataset.output.dom);
											var html = Engine.Plugins.organizations.GUI.buttons.details(sub_dataset.output.dom,{remove:Engine.Auth.validate('custom', 'organizations_organizations', 4)});
											if(td.find('button[data-action="link"]').length > 0){
												td.find('button[data-action="link"]').before(html);
											} else { td.append(html); }
											sub_dataset.output.dom.owner = sub_dataset.output.timeline.owner;
											sub_dataset.output.dom.created = sub_dataset.output.timeline.created;
											Engine.Builder.Timeline.add.client(layout.timeline,sub_dataset.output.dom,'building','secondary',function(item){
												if((Engine.Auth.validate('plugin','organizations',1))&&(Engine.Auth.validate('view','details',1,'organizations'))){
													item.find('i').first().addClass('pointer');
													item.find('i').first().off().click(function(){
														Engine.CRUD.read.show({ key:'name',keys:sub_dataset.output.dom, href:"?p=organizations&v=details&id="+sub_dataset.output.dom.name, modal:true });
													});
												}
											});
											Engine.Plugins.organizations.Events.subsidiaries(dataset,layout);
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
			if(Engine.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="services"]');
			td.find('button').off().click(function(){
				var button = $(this);
				if(button.attr('data-action') != "link"){ var service = {raw:dataset.details.services.raw[button.attr('data-id')],dom:dataset.details.services.dom[button.attr('data-id')]}; }
				switch(button.attr('data-action')){
					case"details":
						Engine.CRUD.read.show({ key:'name',keys:service.dom, href:"?p=services&v=details&id="+service.raw.name, modal:true });
						break;
					case"unlink":
						Engine.request('organizations','unlink',{data:{id:dataset.this.raw.id,relationship:{relationship:'services',link_to:service.raw.id}}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								layout.timeline.find('[data-type="hand-holding-usd"][data-id="'+sub_dataset.output.id+'"]').remove();
								td.find('.btn-group[data-id="'+sub_dataset.output.id+'"]').remove();
							}
						});
						break;
					case"link":
						Engine.Builder.modal($('body'), {
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
							Engine.Builder.input(body, 'service', null,{plugin:'services'}, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>'+Engine.Contents.Language['Link']+'</button>');
							footer.find('button[data-action="link"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									Engine.request('organizations','link',{data:{id:dataset.this.dom.id,relationship:{relationship:'services',link_to:body.find('select').select2('val')}}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											Engine.Helper.set(Engine.Contents,['data','dom','services',sub_dataset.output.dom.id],sub_dataset.output.dom);
											Engine.Helper.set(Engine.Contents,['data','raw','services',sub_dataset.output.raw.id],sub_dataset.output.raw);
											Engine.Helper.set(dataset.details,['services','dom',sub_dataset.output.dom.id],sub_dataset.output.dom);
											Engine.Helper.set(dataset.details,['services','raw',sub_dataset.output.raw.id],sub_dataset.output.raw);
											Engine.Helper.set(dataset,['relations','services',sub_dataset.output.dom.id],sub_dataset.output.dom);
											var html = Engine.Plugins.organizations.GUI.buttons.details(sub_dataset.output.dom,{remove:Engine.Auth.validate('custom', 'organizations_services', 4),icon:{details:"fas fa-hand-holding-usd"}});
											if(td.find('button[data-action="link"]').length > 0){
												td.find('button[data-action="link"]').before(html);
											} else { td.append(html); }
											sub_dataset.output.dom.owner = sub_dataset.output.timeline.owner;
											sub_dataset.output.dom.created = sub_dataset.output.timeline.created;
											Engine.Builder.Timeline.add.service(layout.timeline,sub_dataset.output.dom,'hand-holding-usd','success',function(item){
												if((Engine.Auth.validate('plugin','services',1))&&(Engine.Auth.validate('view','details',1,'services'))){
													item.find('i').first().addClass('pointer');
													item.find('i').first().off().click(function(){
														Engine.CRUD.read.show({ key:'name',keys:sub_dataset.output.dom, href:"?p=services&v=details&id="+sub_dataset.output.dom.name, modal:true });
													});
												}
											});
											Engine.Plugins.organizations.Events.services(dataset,layout);
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
			if(Engine.Helper.isSet(options,['field'])){ defaults.field = options.field; }
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
						Engine.CRUD.read.show({ key:'name',keys:issue.dom, href:"?p=issues&v=details&id="+issue.raw.id, modal:true });
						break;
					case"unlink":
						Engine.request('organizations','unlink',{data:{id:dataset.this.raw.id,relationship:{relationship:'issues',link_to:issue.raw.id}}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								layout.timeline.find('[data-type="gavel"][data-id="'+sub_dataset.output.id+'"]').remove();
								td.find('.btn-group[data-id="'+sub_dataset.output.id+'"]').remove();
							}
						});
						break;
					case"link":
						Engine.Builder.modal($('body'), {
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
							Engine.Builder.input(body, 'issue', null,{plugin:'issues'}, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="link"><i class="fas fa-link mr-1"></i>'+Engine.Contents.Language['Link']+'</button>');
							footer.find('button[data-action="link"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									Engine.request('organizations','link',{data:{id:dataset.this.dom.id,relationship:{relationship:'issues',link_to:body.find('select').select2('val')}}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											Engine.Helper.set(Engine.Contents,['data','dom','issues',sub_dataset.output.dom.id],sub_dataset.output.dom);
											Engine.Helper.set(Engine.Contents,['data','raw','issues',sub_dataset.output.raw.id],sub_dataset.output.raw);
											Engine.Helper.set(dataset.details,['issues','dom',sub_dataset.output.dom.id],sub_dataset.output.dom);
											Engine.Helper.set(dataset.details,['issues','raw',sub_dataset.output.raw.id],sub_dataset.output.raw);
											sub_dataset.output.dom.status = 1;
											Engine.Helper.set(dataset,['relations','issues',sub_dataset.output.dom.id],sub_dataset.output.dom);
											var html = Engine.Plugins.organizations.GUI.buttons.details(sub_dataset.output.dom,{
												remove:Engine.Auth.validate('custom', 'organizations_issues', 4),
												content:sub_dataset.output.dom.id+' - '+sub_dataset.output.dom.name+' - '+Engine.Contents.Statuses.issues['1'].name,
												color:{
													details:Engine.Contents.Statuses.issues['1'].color
												},
												icon:{
													details:Engine.Contents.Statuses.issues['1'].icon
												},
											});
											if(td.find('button[data-action="link"]').length > 0){
												td.find('button[data-action="link"]').before(html);
											} else { td.append(html); }
											sub_dataset.output.dom.owner = sub_dataset.output.timeline.owner;
											sub_dataset.output.dom.created = sub_dataset.output.timeline.created;
											sub_dataset.output.dom.statuses = sub_dataset.output.timeline.statuses;
											sub_dataset.output.dom.status = 1;
											Engine.Builder.Timeline.add.issue(layout.timeline,sub_dataset.output.dom,'gavel','indigo',function(item){
												if((Engine.Auth.validate('plugin','issues',1))&&(Engine.Auth.validate('view','details',1,'issues'))){
													item.find('i').first().addClass('pointer');
													item.find('i').first().off().click(function(){
														Engine.CRUD.read.show({ key:'name',keys:sub_dataset.output.dom, href:"?p=issues&v=details&id="+sub_dataset.output.dom.id, modal:true });
													});
												}
											});
											Engine.Plugins.organizations.Events.issues(dataset,layout);
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
			if(Engine.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="tags"]');
			td.find('button').off().click(function(){
				var button = $(this);
				switch(button.attr('data-action')){
					case"untag":
						Engine.request('organizations','untag',{data:{id:dataset.this.raw.id,tag:button.attr('data-id')}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){ td.find('.btn-group[data-id="'+sub_dataset.output.tag+'"]').remove(); }
						});
						break;
					case"tag":
						Engine.Builder.modal($('body'), {
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
							Engine.Builder.input(body, 'tag', null, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="tag"><i class="fas fa-tag mr-1"></i>'+Engine.Contents.Language['Tag']+'</button>');
							footer.find('button[data-action="tag"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									var tags = [];
									td.find('div.btn-group[data-id]').each(function(){ tags.push($(this).attr('data-id')); });
									for(var [key, tag] of Object.entries(body.find('select').select2('val'))){
										if(tag != '' && jQuery.inArray(tag, tags) === -1){ tags.push(tag); }
									}
									Engine.request('organizations','tag',{data:{id:dataset.this.dom.id,tags:tags}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											for(var [key, tag] of Object.entries(sub_dataset.output.tags)){
												if(tag != '' && td.find('div.btn-group[data-id="'+tag+'"]').length <= 0){
													var html = Engine.Plugins.organizations.GUI.buttons.details({name:tag},{
														remove:Engine.Auth.validate('custom', 'organizations_tags', 4),
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
											Engine.Plugins.organizations.Events.tags(dataset,layout);
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
			if(Engine.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var td = layout.details.find('td[data-plugin="organizations"][data-key="assigned_to"]');
			td.find('button').off().click(function(){
				var button = $(this);
				if(button.attr('data-action') != "assign"){
					if(Engine.Helper.isSet(Engine.Contents,['data','raw','users',button.attr('data-id')])){
						var user = {raw:Engine.Contents.data.raw.users[button.attr('data-id')],dom:{}};
						user.dom = Engine.Contents.data.dom.users[user.raw.username];
					} else {
						var user = {
							dom:dataset.details.users.dom[button.attr('data-id')],
							raw:dataset.details.users.raw[button.attr('data-id')],
						};
					}
				}
				switch(button.attr('data-action')){
					case"details":
						Engine.CRUD.read.show({ key:'username',keys:user.dom, href:"?p=users&v=details&id="+user.raw.username, modal:true });
						break;
					case"unassign":
						Engine.request('organizations','unassign',{data:{id:dataset.this.raw.id,user:button.attr('data-id')}},function(result){
							var sub_dataset = JSON.parse(result);
							if(sub_dataset.success != undefined){
								td.find('.btn-group[data-id="'+sub_dataset.output.user+'"]').remove();
							}
						});
						break;
					case"assign":
						Engine.Builder.modal($('body'), {
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
							Engine.Builder.input(body, 'user', null, function(input){});
							footer.append('<button class="btn btn-secondary" data-action="assign"><i class="fas fa-user-plus mr-1"></i>'+Engine.Contents.Language['Assign']+'</button>');
							footer.find('button[data-action="assign"]').click(function(){
								if((typeof body.find('select').select2('val') !== "undefined")&&(body.find('select').select2('val') != '')){
									Engine.request('organizations','assign',{data:{id:dataset.this.dom.id,user:body.find('select').select2('val')}},function(result){
										var sub_dataset = JSON.parse(result);
										if(sub_dataset.success != undefined){
											for(var [key, user] of Object.entries(sub_dataset.output.organization.raw.assigned_to.split(';'))){
												if(user != '' && td.find('div.btn-group[data-id="'+user+'"]').length <= 0){
													user = {
														dom:sub_dataset.output.users.dom[user],
														raw:sub_dataset.output.users.raw[user],
													};
													Engine.Helper.set(Engine.Contents,['data','dom','users',user.dom.username],user.dom);
													Engine.Helper.set(Engine.Contents,['data','raw','users',user.raw.id],user.raw);
													Engine.Helper.set(dataset.details,['users','dom',user.dom.id],user.dom);
													Engine.Helper.set(dataset.details,['users','dom',user.raw.id],user.raw);
													var html = Engine.Plugins.organizations.GUI.buttons.details(user.dom,{
														remove:Engine.Auth.validate('custom', 'organizations_users', 4),
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
											Engine.Plugins.organizations.Events.users(dataset,layout);
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
		calls:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(Engine.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var calls = layout.content.calls.find('div.row').eq(1);
			var search = layout.content.calls.find('div.row').eq(0);
			var skeleton = {};
			for(var [field, settings] of Object.entries(Engine.Contents.Settings.Structure.calls)){ skeleton[field] = ''; }
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
				Engine.CRUD.read.show({ key:{id:$(this).parent().attr('data-id')}, title:$(this).parent().attr('data-phone'), href:"?p=calls&v=details&id="+$(this).parent().attr('data-id'), modal:true });
			});
			calls.find('tr td button').off().click(function(){
				var button = $(this);
				var tr = button.parents().eq(2);
				var call = dataset.relations.calls[tr.attr('data-id')];
				switch(button.attr('data-action')){
					case"end":
						Engine.Plugins.calls.Events.end(dataset,call);
						break;
				}
			});
		},
		callbacks:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {field: "name"};
			if(Engine.Helper.isSet(options,['field'])){ defaults.field = options.field; }
			var calls = layout.content.callbacks.find('div.row').eq(1);
			var search = layout.content.callbacks.find('div.row').eq(0);
			var skeleton = {};
			for(var [field, settings] of Object.entries(Engine.Contents.Settings.Structure.calls)){ skeleton[field] = ''; }
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
				Engine.Builder.modal($('body'), {
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
					Engine.Builder.input(body.find('div.row'), 'date', null,{plugin:'organizations'}, function(input){
						input.wrap('<div class="col-md-6"></div>');
					});
					Engine.Builder.input(body.find('div.row'), 'time', null,{plugin:'organizations'}, function(input){
						input.wrap('<div class="col-md-6"></div>');
					});
					if(Engine.Helper.isSet(dataset,['relations','contacts'])){
						var contacts = {};
						for(var [id, values] of Object.entries(dataset.relations.contacts)){
							contacts[id] = '';
							if(values.name != ''){ if(contacts[id] != ''){ contacts[id] += ' - '+values.name; } else { contacts[id] += values.name; } }
							if(values.job_title != ''){ if(contacts[id] != ''){ contacts[id] += ' - '+values.job_title; } else { contacts[id] += values.job_title; } }
							if(values.phone != ''){ if(contacts[id] != ''){ contacts[id] += ' - '+values.phone; } else { contacts[id] += values.phone; } }
							if(values.email != ''){ if(contacts[id] != ''){ contacts[id] += ' - '+values.email; } else { contacts[id] += values.email; } }
						}
						Engine.Builder.input(body.find('div.row'), 'contact', null,{plugin:'organizations',list:{contacts:contacts}}, function(input){
							input.wrap('<div class="col-md-12 mt-3"></div>');
						});
					}
					footer.append('<button class="btn btn-success" data-action="create"><i class="fas fa-phone-square mr-1"></i>'+Engine.Contents.Language['Create']+'</button>');
					footer.find('button[data-action="create"]').click(function(){
						var call = {
							date:body.find('input[data-key="date"]').val(),
							time:body.find('input.datetimepicker-input[data-key="time"]').val(),
							contact:body.find('select').select2('val'),
							status:1,
							assigned_to:Engine.Contents.Auth.User.id,
							relationship:'organizations',
							link_to:dataset.this.raw.id,
						};
						Engine.request('calls','create',{data:call},function(result){
							var response = JSON.parse(result);
							if(typeof response.success !== 'undefined'){
								Engine.Helper.set(dataset,['details','calls','dom',response.output.dom.id],response.output.dom);
								Engine.Helper.set(dataset,['details','calls','raw',response.output.raw.id],response.output.raw);
								Engine.Helper.set(dataset,['relations','calls',response.output.dom.id],response.output.dom);
								Engine.Plugins.organizations.GUI.call(dataset,layout,response.output.dom);
								Engine.Plugins.organizations.Events.callbacks(dataset,layout);
								Engine.Builder.Timeline.add.call(layout.timeline,response.output.dom,'phone-square','olive',function(item){
									item.find('i').first().addClass('pointer');
									item.find('i').first().off().click(function(){
										Engine.CRUD.read.show({ key:{id:item.attr('data-id')}, title:item.attr('data-phone'), href:"?p=calls&v=details&id="+item.attr('data-id'), modal:true });
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
				Engine.CRUD.read.show({ key:{id:$(this).parent().attr('data-id')}, title:$(this).parent().attr('data-phone'), href:"?p=calls&v=details&id="+$(this).parent().attr('data-id'), modal:true });
			});
			calls.find('tr td button').off().click(function(){
				var button = $(this);
				var tr = button.parents().eq(2);
				var call = dataset.relations.calls[tr.attr('data-id')];
				switch(button.attr('data-action')){
					case"start":
						Engine.Plugins.calls.Events.start(dataset,call);
						break;
					case"cancel":
						Engine.Plugins.calls.Events.cancel(dataset,call);
						break;
					case"reschedule":
						Engine.Plugins.calls.Events.reschedule(dataset,call);
						break;
				}
			});
		},
	},
		// 			// Settings
		// 			if(Engine.Auth.validate('custom', 'organizations_settings', 1)){
		// 				container.find('#organizations_main_card_tabs .nav-item .nav-link[href="#organizations_settings"]').parent().show();
		// 				for(var [key, value] of Object.entries(dataset.output.this.raw)){
		// 					if(key.startsWith("is")){
		// 						var setHTML = '';
		// 						setHTML += '<div class="col-md-6 col-sm-12 my-1">';
		// 							setHTML += '<div class="input-group">';
		// 								setHTML += '<div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-toggle-off mr-1"></i>'+Engine.Contents.Language[key]+'</span></div>';
		// 								setHTML += '<input type="text" class="form-control switch-spacer" disabled>';
		// 								setHTML += '<div class="input-group-append">';
		// 									setHTML += '<div class="input-group-text p-1">';
		// 										if((value == "yes")||(value == "true")){
		// 											setHTML += '<input type="checkbox" data-key="'+key+'" title="'+Engine.Contents.Language[key]+'" checked>';
		// 										} else {
		// 											setHTML += '<input type="checkbox" data-key="'+key+'" title="'+Engine.Contents.Language[key]+'">';
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
		// 								Engine.request('organizations','update',{ data:dataset.output.this.raw });
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
		// 						setHTML += '<input type="text" class="form-control" placeholder="'+Engine.Contents.Language['Domain']+'" name="setDomain" value="'+dataset.output.this.raw.setDomain+'">';
		// 					setHTML += '</div>';
		// 				setHTML += '</div>';
		// 				setHTML += '<div class="col-12 my-1">';
		// 					setHTML += '<div class="input-group">';
		// 						setHTML += '<div class="input-group-prepend">';
		// 							setHTML += '<span class="input-group-text"><i class="fas fa-server"></i></span>';
		// 						setHTML += '</div>';
		// 						setHTML += '<input type="text" class="form-control" placeholder="'+Engine.Contents.Language['Host']+'" name="setSMTPhost" value="'+dataset.output.this.raw.setSMTPhost+'">';
		// 						setHTML += '<div class="input-group-prepend">';
		// 							setHTML += '<span class="input-group-text"><i class="fas fa-key"></i></span>';
		// 						setHTML += '</div>';
		// 						setHTML += '<select name="setSMTPencryption" class="form-control">';
		// 							setHTML += '<option value="SSL" '+checkSSL+'>'+Engine.Contents.Language['SSL']+'</option>';
		// 							setHTML += '<option value="STARTTLS" '+checkSTARTTLS+'>'+Engine.Contents.Language['STARTTLS']+'</option>';
		// 						setHTML += '</select>';
		// 						setHTML += '<div class="input-group-prepend">';
		// 							setHTML += '<span class="input-group-text"><i class="fas fa-ethernet"></i></span>';
		// 						setHTML += '</div>';
		// 						setHTML += '<input type="number" class="form-control" placeholder="'+Engine.Contents.Language['Port']+'" name="setSMTPport" value="'+dataset.output.this.raw.setSMTPport+'">';
		// 					setHTML += '</div>';
		// 				setHTML += '</div>';
		// 				setHTML += '<div class="col-12 my-1">';
		// 					setHTML += '<button type="button" class="btn btn-block btn-success">';
		// 						setHTML += '<i class="fas fa-save mr-1"></i>'+Engine.Contents.Language['Save'];
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
		// 					Engine.request('organizations','update',{data:dataset.output.this.raw},function(result){
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

Engine.Plugins.organizations.init();
