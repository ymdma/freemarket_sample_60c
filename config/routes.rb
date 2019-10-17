Rails.application.routes.draw do
  devise_for :users
  root "items#index"
  resources :items
  get "detail" => "items#detail"
  get "exhibit" => "items#exhibit"
  get "exhibit_after" => "items#exhibit_after"
  get "logout" => "items#logout"
  get "profile" => "items#profile"

  resources :users
  resources :signup do
    collection do
      get 'step1'
      get 'step2'
      # get 'step3'
      # get 'step4'
      # get 'step5'
      get 'done'
    end
  end
end

